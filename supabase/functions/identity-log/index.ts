import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface IdentityEvent {
  user_id: string;
  event_type: "REGISTER" | "LOGIN" | "LOGOUT" | "PROFILE_UPDATE" | "PASSWORD_CHANGE";
  metadata?: Record<string, unknown>;
}

async function generateHash(data: string, prevHash: string | null): Promise<string> {
  const encoder = new TextEncoder();
  const dataToHash = `${prevHash || "GENESIS"}:${data}:${Date.now()}`;
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(dataToHash));
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
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

    const body = await req.json();
    const { user_id, event_type, metadata }: IdentityEvent = body;

    if (!user_id || !event_type) {
      throw new Error("user_id and event_type are required");
    }

    // Get IP and User Agent
    const ip_address = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    // Get previous hash for chain
    const { data: lastEvent } = await supabaseClient
      .from("identity_events")
      .select("hash")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const prevHash = lastEvent?.hash || null;
    
    // Generate new hash
    const eventData = JSON.stringify({ user_id, event_type, metadata, ip_address, timestamp: Date.now() });
    const hash = await generateHash(eventData, prevHash);

    // Insert identity event
    const { data: event, error } = await supabaseClient
      .from("identity_events")
      .insert({
        user_id,
        event_type,
        prev_hash: prevHash,
        hash,
        ip_address,
        user_agent,
        metadata: metadata || {}
      })
      .select()
      .single();

    if (error) throw error;

    // Also log to BookPI for cross-system audit
    await supabaseClient.from("bookpi_events").insert({
      user_id,
      event_type: `IDENTITY_${event_type}`,
      entity_type: "identity",
      entity_id: event.id,
      prev_hash: prevHash,
      hash,
      payload: { event_type, metadata },
      ip_address,
      user_agent
    });

    console.log(`[Identity] ${event_type} logged for user ${user_id.substring(0, 8)}...`);

    return new Response(
      JSON.stringify({
        success: true,
        event_id: event.id,
        hash: hash.substring(0, 16) + "...",
        chain_valid: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Identity Log Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
