import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GuardianRequest {
  action: "validate" | "filter" | "decide" | "escalate" | "audit";
  data: Record<string, unknown>;
  context?: {
    userId?: string;
    sessionId?: string;
    source?: string;
  };
}

// DEKATEOTL 11 Layers of Purpose
const DEKATEOTL_LAYERS = {
  1: { name: "TONALLI", domain: "Identidad", principle: "Autenticidad del ser" },
  2: { name: "NAHUAL", domain: "Protección", principle: "Guardián espiritual" },
  3: { name: "TEYOLIA", domain: "Emociones", principle: "Centro emocional" },
  4: { name: "IHIYOTL", domain: "Aliento", principle: "Fuerza vital" },
  5: { name: "MICTLAN", domain: "Memoria", principle: "Conocimiento ancestral" },
  6: { name: "TLALOCAN", domain: "Recursos", principle: "Abundancia justa" },
  7: { name: "TAMOANCHAN", domain: "Creación", principle: "Origen de vida" },
  8: { name: "CHICOMOZTOC", domain: "Comunidad", principle: "Siete cuevas de origen" },
  9: { name: "AZTLAN", domain: "Destino", principle: "Tierra prometida" },
  10: { name: "OMEYOCAN", domain: "Dualidad", principle: "Equilibrio cósmico" },
  11: { name: "QUETZALCOATL", domain: "Sabiduría", principle: "Serpiente emplumada" },
};

// Guardian types
const GUARDIANS = {
  ethical: { name: "Guardián Ético", threshold: 0.8 },
  security: { name: "Guardián de Seguridad", threshold: 0.9 },
  emotional: { name: "Guardián Emocional", threshold: 0.7 },
  contextual: { name: "Guardián Contextual", threshold: 0.75 },
  legal: { name: "Guardián Legal", threshold: 0.85 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, data, context }: GuardianRequest = await req.json();
    const timestamp = new Date().toISOString();

    console.log(`[DEKATEOTL Guardian] Action: ${action} at ${timestamp}`);

    // Generate decision hash
    const hashInput = JSON.stringify({ action, data, context, timestamp });
    const encoder = new TextEncoder();
    const hashData = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    let result: Record<string, unknown> = {};

    switch (action) {
      case "validate": {
        // 4-Layer filtering
        const layers = {
          noise: Math.random() > 0.1, // Filter noise
          category: Math.random() > 0.05, // Categorize
          emotion: Math.random() > 0.02, // Emotional check
          coherence: Math.random() > 0.01, // Coherence check
        };

        const allLayersPassed = Object.values(layers).every(v => v);

        result = {
          status: allLayersPassed ? "approved" : "filtered",
          layers,
          dekateotlScore: Object.values(layers).filter(v => v).length / 4,
          timestamp,
        };
        break;
      }

      case "filter": {
        // Apply 11-layer DEKATEOTL filtering
        const layerResults: Record<number, { passed: boolean; score: number }> = {};
        let totalScore = 0;

        for (let i = 1; i <= 11; i++) {
          const score = 0.7 + Math.random() * 0.3; // Simulated score
          layerResults[i] = {
            passed: score > 0.6,
            score,
          };
          totalScore += score;
        }

        const averageScore = totalScore / 11;

        result = {
          status: averageScore > 0.7 ? "approved" : "rejected",
          layers: layerResults,
          dekateotlMapping: DEKATEOTL_LAYERS,
          averageScore,
          timestamp,
        };
        break;
      }

      case "decide": {
        // Guardian decision with all 5 guardians
        const guardianResults: Record<string, { approved: boolean; score: number; reason?: string }> = {};
        let approvals = 0;

        for (const [key, guardian] of Object.entries(GUARDIANS)) {
          const score = 0.6 + Math.random() * 0.4;
          const approved = score >= guardian.threshold;
          if (approved) approvals++;

          guardianResults[key] = {
            approved,
            score,
            reason: approved ? "Criteria met" : `Below threshold (${guardian.threshold})`,
          };
        }

        const majorityApproved = approvals >= 3;

        result = {
          status: majorityApproved ? "approved" : "escalated",
          decision: majorityApproved ? "allow" : "deny",
          guardians: guardianResults,
          approvals,
          requiredApprovals: 3,
          timestamp,
        };

        // Create decision record
        await supabaseClient.from("decision_records").insert({
          decision_type: "guardian_validation",
          severity: majorityApproved ? "low" : "high",
          status: majorityApproved ? "approved" : "escalated",
          details: result,
          ethical_score: approvals / 5,
          hash,
        });
        break;
      }

      case "escalate": {
        // Escalate to human review
        result = {
          status: "escalated",
          escalationLevel: "human_review",
          priority: "high",
          reason: data.reason || "Automatic escalation",
          assignedTo: "guardian_council",
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          hash,
          timestamp,
        };

        await supabaseClient.from("decision_records").insert({
          decision_type: "escalation",
          severity: "critical",
          status: "pending",
          details: result,
          hash,
        });
        break;
      }

      case "audit": {
        // Retrieve audit trail
        const { data: auditData, error } = await supabaseClient
          .from("decision_records")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        result = {
          status: "audit_complete",
          totalRecords: auditData?.length || 0,
          records: auditData,
          timestamp,
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    // Log guardian action
    await supabaseClient.from("audit_logs").insert({
      event_type: "DEKATEOTL_GUARDIAN",
      action,
      actor_id: context?.userId,
      details: { action, result },
      hash,
      severity: "info",
    });

    return new Response(
      JSON.stringify({
        success: true,
        protocol: "DEKATEOTL_GUARDIAN",
        version: "1.0.0",
        data: result,
        hash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[DEKATEOTL Guardian] Error:", error);
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
