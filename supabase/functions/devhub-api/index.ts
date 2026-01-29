import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "TAMV DevHub API",
    description: "API pública del ecosistema TAMV Civilizatorio",
    version: "1.0.0",
    contact: {
      name: "TAMV DevHub",
      url: "https://tamv.online/devhub"
    }
  },
  servers: [
    {
      url: "/functions/v1/devhub-api",
      description: "Production API"
    }
  ],
  paths: {
    "/posts": {
      get: {
        summary: "Get public posts feed",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } }
        ],
        responses: {
          "200": {
            description: "List of public posts"
          }
        }
      }
    },
    "/users/{id}": {
      get: {
        summary: "Get public user profile",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "User profile"
          }
        }
      }
    },
    "/bookpi/events": {
      get: {
        summary: "Get audit trail events (limited)",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 100 } }
        ],
        responses: {
          "200": {
            description: "Recent audit events (anonymized)"
          }
        }
      }
    },
    "/stats": {
      get: {
        summary: "Get platform statistics",
        responses: {
          "200": {
            description: "Platform statistics"
          }
        }
      }
    }
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Remove function name from path
    const endpoint = pathParts.slice(pathParts.indexOf("devhub-api") + 1).join("/");

    // OpenAPI Spec
    if (endpoint === "openapi.json" || endpoint === "spec") {
      return new Response(
        JSON.stringify(OPENAPI_SPEC, null, 2),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /posts
    if (endpoint === "posts" && req.method === "GET") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
      const offset = parseInt(url.searchParams.get("offset") || "0");

      const { data: posts, error, count } = await supabaseClient
        .from("posts")
        .select(`
          id, content, media_url, media_type, likes_count, comments_count, created_at,
          author:profiles!posts_user_id_fkey(id, username, full_name, avatar_url)
        `, { count: "exact" })
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          data: posts,
          pagination: { total: count, limit, offset }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /users/:id
    if (endpoint.startsWith("users/") && req.method === "GET") {
      const userId = endpoint.split("/")[1];

      const { data: user, error } = await supabaseClient
        .from("profiles")
        .select("id, username, full_name, avatar_url, bio, badges, reputation_score, created_at")
        .eq("id", userId)
        .single();

      if (error || !user) {
        return new Response(
          JSON.stringify({ success: false, error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get follower/following counts
      const { count: followersCount } = await supabaseClient
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);

      const { count: followingCount } = await supabaseClient
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);

      const { count: postsCount } = await supabaseClient
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("visibility", "public");

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            ...user,
            stats: {
              followers: followersCount || 0,
              following: followingCount || 0,
              posts: postsCount || 0
            }
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /bookpi/events
    if (endpoint === "bookpi/events" && req.method === "GET") {
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "10"), 100);

      const { data: events, error } = await supabaseClient
        .from("bookpi_events")
        .select("id, event_type, entity_type, hash, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Anonymize events
      const anonymizedEvents = events?.map(e => ({
        id: e.id,
        event_type: e.event_type,
        entity_type: e.entity_type,
        hash_preview: e.hash?.substring(0, 16) + "...",
        timestamp: e.created_at
      }));

      return new Response(
        JSON.stringify({ success: true, data: anonymizedEvents }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /stats
    if (endpoint === "stats" && req.method === "GET") {
      const { count: usersCount } = await supabaseClient
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: postsCount } = await supabaseClient
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("visibility", "public");

      const { count: eventsCount } = await supabaseClient
        .from("bookpi_events")
        .select("*", { count: "exact", head: true });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            total_users: usersCount || 0,
            total_posts: postsCount || 0,
            total_audit_events: eventsCount || 0,
            api_version: "1.0.0",
            status: "operational"
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default: API info
    return new Response(
      JSON.stringify({
        name: "TAMV DevHub API",
        version: "1.0.0",
        endpoints: [
          "GET /posts",
          "GET /users/:id",
          "GET /bookpi/events",
          "GET /stats",
          "GET /openapi.json"
        ],
        documentation: "https://tamv.online/devhub"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("DevHub API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
