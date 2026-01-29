import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface HITLAction {
  event_id: string;
  action: "APPROVE" | "EDIT" | "BLOCK";
  notes?: string;
  edited_content?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user is guardian or admin
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = claims.claims.sub as string;

    // Check if user has guardian or admin role
    const { data: hasRole } = await serviceClient.rpc("has_role", {
      _user_id: userId,
      _role: "guardian"
    });

    const { data: hasAdminRole } = await serviceClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin"
    });

    if (!hasRole && !hasAdminRole) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Guardian or Admin role required" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { action: hitlAction } = body;

    if (hitlAction === "resolve") {
      const { event_id, action, notes, edited_content }: HITLAction = body;

      if (!event_id || !action) {
        throw new Error("event_id and action are required");
      }

      if (!["APPROVE", "EDIT", "BLOCK"].includes(action)) {
        throw new Error("Invalid action. Must be APPROVE, EDIT, or BLOCK");
      }

      // Get the event
      const { data: event, error: eventError } = await serviceClient
        .from("isabella_events")
        .select("*")
        .eq("id", event_id)
        .eq("requires_hitl", true)
        .single();

      if (eventError || !event) {
        throw new Error("Event not found or doesn't require HITL");
      }

      // Update the event
      const updateData: Record<string, unknown> = {
        hitl_status: action.toLowerCase(),
        hitl_resolved_by: userId,
        hitl_resolved_at: new Date().toISOString(),
        hitl_notes: notes || null
      };

      if (action === "EDIT" && edited_content) {
        updateData.metadata = {
          ...event.metadata,
          original_content: event.content,
          edited_content
        };
      }

      const { error: updateError } = await serviceClient
        .from("isabella_events")
        .update(updateData)
        .eq("id", event_id);

      if (updateError) throw updateError;

      // Log to BookPI
      await serviceClient.from("bookpi_events").insert({
        user_id: userId,
        event_type: `HITL_${action}`,
        entity_type: "isabella_event",
        entity_id: event_id,
        hash: crypto.randomUUID(), // Simplified hash for now
        payload: {
          action,
          notes,
          original_user_id: event.user_id,
          resolved_by: userId
        }
      });

      console.log(`[HITL] ${action} on event ${event_id} by ${userId}`);

      return new Response(
        JSON.stringify({
          success: true,
          event_id,
          action,
          resolved_by: userId,
          resolved_at: updateData.hitl_resolved_at
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (hitlAction === "list_pending") {
      const { limit = 50, offset = 0 } = body;

      const { data: events, error, count } = await serviceClient
        .from("isabella_events")
        .select("*, profiles:user_id(username, full_name, avatar_url)", { count: "exact" })
        .eq("requires_hitl", true)
        .eq("hitl_status", "pending")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          events,
          count,
          offset,
          limit
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (hitlAction === "stats") {
      const { data: stats } = await serviceClient
        .from("isabella_events")
        .select("hitl_status")
        .eq("requires_hitl", true);

      const counts = {
        pending: 0,
        approved: 0,
        edited: 0,
        blocked: 0,
        total: stats?.length || 0
      };

      stats?.forEach(e => {
        if (e.hitl_status === "pending") counts.pending++;
        if (e.hitl_status === "approved") counts.approved++;
        if (e.hitl_status === "edited") counts.edited++;
        if (e.hitl_status === "blocked") counts.blocked++;
      });

      return new Response(
        JSON.stringify({ success: true, stats: counts }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${hitlAction}`);

  } catch (error) {
    console.error("HITL Resolve Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
