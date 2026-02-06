import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  action: string;
  userId?: string;
  type?: string;
  title?: string;
  content?: string;
  actorId?: string;
  referenceType?: string;
  referenceId?: string;
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

    const { action, userId, type, title, content, actorId, referenceType, referenceId } = 
      await req.json() as NotificationRequest;

    let result: unknown;

    switch (action) {
      case "create":
        if (!userId || !type || !title) {
          throw new Error("userId, type and title are required");
        }

        const { data: notification, error: createError } = await supabaseClient
          .from("notifications")
          .insert({
            user_id: userId,
            type,
            title,
            content,
            actor_id: actorId,
            reference_type: referenceType,
            reference_id: referenceId
          })
          .select()
          .single();

        if (createError) throw createError;
        result = { notification };
        break;

      case "createBulk":
        const { notifications } = await req.json();
        
        const { data: bulkNotifs, error: bulkError } = await supabaseClient
          .from("notifications")
          .insert(notifications)
          .select();

        if (bulkError) throw bulkError;
        result = { notifications: bulkNotifs };
        break;

      case "markRead":
        const { notificationId } = await req.json();
        
        const { error: readError } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId);

        if (readError) throw readError;
        result = { success: true };
        break;

      case "markAllRead":
        if (!userId) throw new Error("userId required");

        const { error: allReadError } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId)
          .eq("read", false);

        if (allReadError) throw allReadError;
        result = { success: true };
        break;

      case "getUnreadCount":
        if (!userId) throw new Error("userId required");

        const { count, error: countError } = await supabaseClient
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("read", false);

        if (countError) throw countError;
        result = { count: count || 0 };
        break;

      case "notifyLike":
        const { postOwnerId, likerName, postId } = await req.json();
        
        if (postOwnerId) {
          await supabaseClient.from("notifications").insert({
            user_id: postOwnerId,
            type: "like",
            title: "Nuevo like",
            content: `${likerName || 'Alguien'} le dio like a tu post`,
            reference_type: "post",
            reference_id: postId
          });
        }
        result = { success: true };
        break;

      case "notifyComment":
        const { postOwner, commenterName, commentPostId } = await req.json();
        
        if (postOwner) {
          await supabaseClient.from("notifications").insert({
            user_id: postOwner,
            type: "comment",
            title: "Nuevo comentario",
            content: `${commenterName || 'Alguien'} comentó en tu post`,
            reference_type: "post",
            reference_id: commentPostId
          });
        }
        result = { success: true };
        break;

      case "notifyFollow":
        const { followedId, followerName } = await req.json();
        
        await supabaseClient.from("notifications").insert({
          user_id: followedId,
          type: "follow",
          title: "Nuevo seguidor",
          content: `${followerName || 'Alguien'} comenzó a seguirte`
        });
        result = { success: true };
        break;

      case "notifyAchievement":
        const { achievementUserId, achievementName, achievementPoints } = await req.json();
        
        await supabaseClient.from("notifications").insert({
          user_id: achievementUserId,
          type: "achievement",
          title: "¡Logro desbloqueado!",
          content: `Conseguiste "${achievementName}" (+${achievementPoints} pts)`
        });
        result = { success: true };
        break;

      case "notifyTransaction":
        const { transactionUserId, transactionType, amount } = await req.json();
        
        await supabaseClient.from("notifications").insert({
          user_id: transactionUserId,
          type: "transaction",
          title: transactionType === "credit" ? "Créditos recibidos" : "Créditos enviados",
          content: `${transactionType === "credit" ? "+" : "-"}${amount} TAMV Credits`
        });
        result = { success: true };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Notifications API Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
