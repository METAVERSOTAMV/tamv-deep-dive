import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      authHeader ? { global: { headers: { Authorization: authHeader } } } : undefined
    );

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    const { action } = body;

    // Get current user if authenticated
    let currentUserId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: claims } = await supabaseClient.auth.getClaims(token);
      currentUserId = claims?.claims?.sub as string || null;
    }

    // ==================== POSTS ====================
    if (action === "get_feed") {
      const { limit = 20, offset = 0, user_id } = body;

      let query = supabaseClient
        .from("posts")
        .select(`
          *,
          author:profiles!posts_user_id_fkey(id, username, full_name, avatar_url),
          user_liked:likes!left(id)
        `, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (user_id) {
        query = query.eq("user_id", user_id);
      }

      const { data: posts, error, count } = await query;

      if (error) throw error;

      // Transform to add user_liked boolean
      const transformedPosts = posts?.map(post => {
        const hasLiked = currentUserId ? post.user_liked?.some((l: { id: string }) => l.id) : false;
        const { user_liked: _, ...rest } = post;
        return { ...rest, user_liked: hasLiked };
      });

      return new Response(
        JSON.stringify({ success: true, posts: transformedPosts, count, offset, limit }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "create_post") {
      if (!currentUserId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: corsHeaders }
        );
      }

      const { content, media_url, media_type, visibility = "public" } = body;

      if (!content || content.trim().length === 0) {
        throw new Error("Content is required");
      }

      if (content.length > 2000) {
        throw new Error("Content must be less than 2000 characters");
      }

      const { data: post, error } = await supabaseClient
        .from("posts")
        .insert({
          user_id: currentUserId,
          content: content.trim(),
          media_url,
          media_type,
          visibility
        })
        .select(`
          *,
          author:profiles!posts_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // Log to BookPI
      await serviceClient.from("bookpi_events").insert({
        user_id: currentUserId,
        event_type: "CREATE_POST",
        entity_type: "post",
        entity_id: post.id,
        hash: crypto.randomUUID(),
        payload: { content_length: content.length, has_media: !!media_url }
      });

      return new Response(
        JSON.stringify({ success: true, post }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ==================== LIKES ====================
    if (action === "toggle_like") {
      if (!currentUserId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: corsHeaders }
        );
      }

      const { post_id, comment_id } = body;

      if (!post_id && !comment_id) {
        throw new Error("post_id or comment_id is required");
      }

      // Check if already liked
      let existingQuery = supabaseClient
        .from("likes")
        .select("id")
        .eq("user_id", currentUserId);

      if (post_id) existingQuery = existingQuery.eq("post_id", post_id);
      if (comment_id) existingQuery = existingQuery.eq("comment_id", comment_id);

      const { data: existing } = await existingQuery.single();

      if (existing) {
        // Unlike
        await supabaseClient.from("likes").delete().eq("id", existing.id);
        return new Response(
          JSON.stringify({ success: true, liked: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Like
        await supabaseClient.from("likes").insert({
          user_id: currentUserId,
          post_id: post_id || null,
          comment_id: comment_id || null
        });
        return new Response(
          JSON.stringify({ success: true, liked: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // ==================== COMMENTS ====================
    if (action === "get_comments") {
      const { post_id, limit = 50, offset = 0 } = body;

      if (!post_id) throw new Error("post_id is required");

      const { data: comments, error, count } = await supabaseClient
        .from("comments")
        .select(`
          *,
          author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
        `, { count: "exact" })
        .eq("post_id", post_id)
        .order("created_at", { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, comments, count }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "create_comment") {
      if (!currentUserId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: corsHeaders }
        );
      }

      const { post_id, content, parent_id } = body;

      if (!post_id || !content) {
        throw new Error("post_id and content are required");
      }

      const { data: comment, error } = await supabaseClient
        .from("comments")
        .insert({
          post_id,
          user_id: currentUserId,
          content: content.trim(),
          parent_id
        })
        .select(`
          *,
          author:profiles!comments_user_id_fkey(id, username, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, comment }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ==================== FOLLOWS ====================
    if (action === "toggle_follow") {
      if (!currentUserId) {
        return new Response(
          JSON.stringify({ error: "Authentication required" }),
          { status: 401, headers: corsHeaders }
        );
      }

      const { user_id: targetUserId } = body;

      if (!targetUserId) throw new Error("user_id is required");
      if (targetUserId === currentUserId) throw new Error("Cannot follow yourself");

      const { data: existing } = await supabaseClient
        .from("follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .single();

      if (existing) {
        await supabaseClient.from("follows").delete().eq("id", existing.id);
        return new Response(
          JSON.stringify({ success: true, following: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        await supabaseClient.from("follows").insert({
          follower_id: currentUserId,
          following_id: targetUserId
        });
        return new Response(
          JSON.stringify({ success: true, following: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (action === "get_followers") {
      const { user_id, limit = 50, offset = 0 } = body;

      if (!user_id) throw new Error("user_id is required");

      const { data: followers, error, count } = await supabaseClient
        .from("follows")
        .select(`
          *,
          follower:profiles!follows_follower_id_fkey(id, username, full_name, avatar_url)
        `, { count: "exact" })
        .eq("following_id", user_id)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, followers, count }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "get_following") {
      const { user_id, limit = 50, offset = 0 } = body;

      if (!user_id) throw new Error("user_id is required");

      const { data: following, error, count } = await supabaseClient
        .from("follows")
        .select(`
          *,
          following:profiles!follows_following_id_fkey(id, username, full_name, avatar_url)
        `, { count: "exact" })
        .eq("follower_id", user_id)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, following, count }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error(`Unknown action: ${action}`);

  } catch (error) {
    console.error("Social API Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
