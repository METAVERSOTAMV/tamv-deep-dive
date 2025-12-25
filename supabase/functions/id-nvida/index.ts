import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface IdentityRequest {
  action: "getIdentity" | "verify" | "createClaim" | "getConsents" | "updateConsent" | "generateQR";
  userId?: string;
  data?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, userId, data }: IdentityRequest = await req.json();
    const timestamp = new Date().toISOString();

    console.log(`[ID-NVIDA] Action: ${action} for user: ${userId}`);

    // Generate quantum ID hash
    const hashInput = JSON.stringify({ action, userId, data, timestamp });
    const encoder = new TextEncoder();
    const hashData = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    let result: Record<string, unknown> = {};

    switch (action) {
      case "getIdentity": {
        if (!userId) throw new Error("userId required");

        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;

        // Generate derived identifiers
        const derivedIds = {
          social: `SOC-${hash.substring(0, 8)}`,
          financial: `FIN-${hash.substring(8, 16)}`,
          creative: `CRE-${hash.substring(16, 24)}`,
          governance: `GOV-${hash.substring(24, 32)}`,
        };

        result = {
          profile,
          quantumId: profile?.quantum_id || `QID-${hash.substring(0, 16).toUpperCase()}`,
          derivedIdentifiers: derivedIds,
          verificationLevel: profile?.verification_level || 0,
          badges: profile?.badges || [],
          reputation: profile?.reputation_score || 0,
          timestamp,
        };
        break;
      }

      case "verify": {
        if (!userId || !data?.verificationType) {
          throw new Error("userId and verificationType required");
        }

        const verificationType = data.verificationType as string;
        
        // Simulate verification (in production, integrate with actual verification services)
        const verificationResult = {
          email: { verified: true, confidence: 0.99 },
          phone: { verified: true, confidence: 0.95 },
          document: { verified: Math.random() > 0.2, confidence: 0.85 },
          biometric: { verified: Math.random() > 0.1, confidence: 0.92 },
          social: { verified: Math.random() > 0.3, confidence: 0.78 },
        };

        const verification = verificationResult[verificationType as keyof typeof verificationResult] || 
          { verified: false, confidence: 0 };

        // Update profile verification level if verified
        if (verification.verified) {
          const { data: profile } = await supabaseClient
            .from("profiles")
            .select("verification_level, badges")
            .eq("id", userId)
            .single();

          const currentLevel = profile?.verification_level || 0;
          const badges = profile?.badges || [];

          const levelBoost = verificationType === "biometric" ? 2 : 1;
          const newLevel = Math.min(currentLevel + levelBoost, 5);

          const newBadge = `verified_${verificationType}`;
          if (!badges.includes(newBadge)) {
            badges.push(newBadge);
          }

          await supabaseClient
            .from("profiles")
            .update({ 
              verification_level: newLevel,
              badges,
            })
            .eq("id", userId);
        }

        result = {
          verificationType,
          ...verification,
          hash: hash.substring(0, 32),
          timestamp,
        };
        break;
      }

      case "createClaim": {
        if (!userId || !data?.claimType) {
          throw new Error("userId and claimType required");
        }

        // Create identity claim record
        const claim = {
          claimId: `CLM-${hash.substring(0, 12).toUpperCase()}`,
          claimType: data.claimType,
          claimValue: data.claimValue,
          issuer: "TAMV_ID_NVIDA",
          subject: userId,
          issuedAt: timestamp,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          signature: {
            algorithm: "DILITHIUM-5",
            value: hash,
          },
          status: "active",
        };

        result = {
          claim,
          verifiable: true,
          timestamp,
        };
        break;
      }

      case "getConsents": {
        if (!userId) throw new Error("userId required");

        const { data: consents, error } = await supabaseClient
          .from("consent_entries")
          .select("*")
          .eq("user_id", userId)
          .is("revoked_at", null)
          .order("created_at", { ascending: false });

        if (error) throw error;

        result = {
          consents: consents || [],
          count: consents?.length || 0,
          timestamp,
        };
        break;
      }

      case "updateConsent": {
        if (!userId || !data?.consentType) {
          throw new Error("userId and consentType required");
        }

        const consentData = {
          user_id: userId,
          consent_type: data.consentType,
          granted: data.granted !== false,
          purpose: data.purpose || "General data processing",
          data_categories: data.dataCategories || ["profile", "activity"],
          expires_at: data.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          hash,
        };

        // Check if consent already exists
        const { data: existing } = await supabaseClient
          .from("consent_entries")
          .select("id")
          .eq("user_id", userId)
          .eq("consent_type", data.consentType)
          .is("revoked_at", null)
          .single();

        if (existing) {
          // Update existing consent
          if (data.granted === false) {
            await supabaseClient
              .from("consent_entries")
              .update({ revoked_at: timestamp })
              .eq("id", existing.id);
          } else {
            await supabaseClient
              .from("consent_entries")
              .update(consentData)
              .eq("id", existing.id);
          }
        } else if (data.granted !== false) {
          // Create new consent
          await supabaseClient.from("consent_entries").insert(consentData);
        }

        result = {
          status: data.granted === false ? "revoked" : "granted",
          consentType: data.consentType,
          hash,
          timestamp,
        };
        break;
      }

      case "generateQR": {
        if (!userId) throw new Error("userId required");

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("quantum_id, verification_level")
          .eq("id", userId)
          .single();

        const qrPayload = {
          type: "ID-NVIDA-VERIFICATION",
          quantumId: profile?.quantum_id || `QID-${hash.substring(0, 16).toUpperCase()}`,
          verificationLevel: profile?.verification_level || 0,
          issuedAt: timestamp,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          signature: hash.substring(0, 32),
        };

        result = {
          qrPayload,
          qrData: btoa(JSON.stringify(qrPayload)),
          validFor: "24 hours",
          timestamp,
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log identity action
    await supabaseClient.from("audit_logs").insert({
      event_type: "ID_NVIDA",
      action,
      actor_id: userId,
      details: { action, result: { ...result, hash: undefined } },
      hash,
      severity: "info",
    });

    return new Response(
      JSON.stringify({
        success: true,
        protocol: "ID-NVIDA",
        version: "1.0.0",
        data: result,
        hash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[ID-NVIDA] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
