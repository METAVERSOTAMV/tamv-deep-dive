import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface BookPIEvent {
  user_id?: string;
  event_type: string;
  entity_type?: string;
  entity_id?: string;
  payload?: Record<string, unknown>;
}

async function generateHash(data: string, prevHash: string | null): Promise<string> {
  const encoder = new TextEncoder();
  const canonical = `${prevHash || "GENESIS"}:${data}:${Date.now()}`;
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(canonical));
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
    const { action } = body;

    if (action === "log") {
      const { user_id, event_type, entity_type, entity_id, payload }: BookPIEvent = body;

      if (!event_type) {
        throw new Error("event_type is required");
      }

      const ip_address = req.headers.get("x-forwarded-for") || "unknown";
      const user_agent = req.headers.get("user-agent") || "unknown";

      // Get last hash for chain integrity
      const { data: lastEvent } = await supabaseClient
        .from("bookpi_events")
        .select("hash")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const prevHash = lastEvent?.hash || null;
      const eventData = JSON.stringify({ user_id, event_type, entity_type, entity_id, payload });
      const hash = await generateHash(eventData, prevHash);

      const { data: event, error } = await supabaseClient
        .from("bookpi_events")
        .insert({
          user_id,
          event_type,
          entity_type,
          entity_id,
          prev_hash: prevHash,
          hash,
          payload: payload || {},
          ip_address,
          user_agent
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[BookPI] ${event_type} logged: ${hash.substring(0, 16)}...`);

      return new Response(
        JSON.stringify({
          success: true,
          event_id: event.id,
          hash,
          prev_hash: prevHash,
          chain_valid: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const { event_id } = body;

      const { data: event, error } = await supabaseClient
        .from("bookpi_events")
        .select("*")
        .eq("id", event_id)
        .single();

      if (error || !event) {
        throw new Error("Event not found");
      }

      // Verify chain by checking previous hash
      let chainValid = true;
      if (event.prev_hash) {
        const { data: prevEvent } = await supabaseClient
          .from("bookpi_events")
          .select("hash")
          .eq("hash", event.prev_hash)
          .single();

        chainValid = !!prevEvent;
      }

      return new Response(
        JSON.stringify({
          success: true,
          event,
          chain_valid: chainValid,
          verified_at: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "audit_trail") {
      const { entity_type, entity_id, limit = 50 } = body;

      let query = supabaseClient
        .from("bookpi_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (entity_type) query = query.eq("entity_type", entity_type);
      if (entity_id) query = query.eq("entity_id", entity_id);

      const { data: events, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          events,
          count: events?.length || 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error("BookPI Log Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
