import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

interface TAMVRequest {
  action: string;
  entity?: string;
  data?: Record<string, unknown>;
  userId?: string;
  filters?: Record<string, unknown>;
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

    const { action, entity, data, userId, filters } = await req.json() as TAMVRequest;

    let result: unknown;

    switch (action) {
      // DreamSpaces
      case "getDreamSpaces":
        const { data: spaces, error: spacesError } = await supabaseClient
          .from("dreamweave_spaces")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (spacesError) throw spacesError;
        result = { spaces, count: spaces?.length || 0 };
        break;

      case "getDreamSpace":
        const { data: space, error: spaceError } = await supabaseClient
          .from("dreamweave_spaces")
          .select("*")
          .eq("id", data?.id)
          .single();
        
        if (spaceError) throw spaceError;
        result = { space };
        break;

      case "createDreamSpace":
        const { data: newSpace, error: createError } = await supabaseClient
          .from("dreamweave_spaces")
          .insert({
            name: data?.name,
            description: data?.description,
            user_id: userId,
            scene_data: data?.sceneData || {},
            is_public: data?.isPublic ?? false
          })
          .select()
          .single();
        
        if (createError) throw createError;
        result = { space: newSpace };
        break;

      case "updateDreamSpace":
        const { data: updatedSpace, error: updateError } = await supabaseClient
          .from("dreamweave_spaces")
          .update({
            name: data?.name,
            description: data?.description,
            scene_data: data?.sceneData,
            is_public: data?.isPublic,
            updated_at: new Date().toISOString()
          })
          .eq("id", data?.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        result = { space: updatedSpace };
        break;

      // Conversations
      case "getConversations":
        const { data: convs, error: convsError } = await supabaseClient
          .from("conversations")
          .select("*, messages(*)")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });
        
        if (convsError) throw convsError;
        result = { conversations: convs };
        break;

      case "createConversation":
        const { data: newConv, error: convCreateError } = await supabaseClient
          .from("conversations")
          .insert({
            title: data?.title || "Nueva conversación",
            user_id: userId
          })
          .select()
          .single();
        
        if (convCreateError) throw convCreateError;
        result = { conversation: newConv };
        break;

      // Messages
      case "getMessages":
        const { data: messages, error: msgsError } = await supabaseClient
          .from("messages")
          .select("*")
          .eq("conversation_id", data?.conversationId)
          .order("created_at", { ascending: true });
        
        if (msgsError) throw msgsError;
        result = { messages };
        break;

      case "createMessage":
        const { data: newMsg, error: msgCreateError } = await supabaseClient
          .from("messages")
          .insert({
            conversation_id: data?.conversationId,
            content: data?.content,
            role: data?.role,
            emotional_state: data?.emotionalState
          })
          .select()
          .single();
        
        if (msgCreateError) throw msgCreateError;
        result = { message: newMsg };
        break;

      // Profiles
      case "getProfile":
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) throw profileError;
        result = { profile };
        break;

      case "updateProfile":
        const { data: updatedProfile, error: profileUpdateError } = await supabaseClient
          .from("profiles")
          .update({
            full_name: data?.fullName,
            username: data?.username,
            avatar_url: data?.avatarUrl,
            bio: data?.bio,
            updated_at: new Date().toISOString()
          })
          .eq("id", userId)
          .select()
          .single();
        
        if (profileUpdateError) throw profileUpdateError;
        result = { profile: updatedProfile };
        break;

      // TAMV Credits
      case "getCredits":
        const { data: credits, error: creditsError } = await supabaseClient
          .from("profiles")
          .select("tamv_credits")
          .eq("id", userId)
          .single();
        
        if (creditsError) throw creditsError;
        result = { credits: credits?.tamv_credits || 0 };
        break;

      case "addCredits":
        const { data: currentCredits } = await supabaseClient
          .from("profiles")
          .select("tamv_credits")
          .eq("id", userId)
          .single();

        const { data: newCredits, error: addCreditsError } = await supabaseClient
          .from("profiles")
          .update({
            tamv_credits: (currentCredits?.tamv_credits || 0) + (data?.amount || 0)
          })
          .eq("id", userId)
          .select("tamv_credits")
          .single();
        
        if (addCreditsError) throw addCreditsError;
        result = { credits: newCredits?.tamv_credits };
        break;

      // System Status
      case "getSystemStatus":
        result = {
          status: "operational",
          version: "1.0.0",
          timestamp: new Date().toISOString(),
          modules: {
            isabella: "active",
            dreamweave: "active",
            kaos: "active",
            dekateotl: "active",
            sentinel: "active"
          }
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("TAMV API Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
