import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EconomyRequest {
  action: "getBalance" | "transfer" | "reward" | "stake" | "getTransactions" | "getLeaderboard";
  userId?: string;
  data?: {
    amount?: number;
    recipientId?: string;
    reason?: string;
    transactionType?: string;
  };
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

    const { action, userId, data }: EconomyRequest = await req.json();
    const timestamp = new Date().toISOString();

    console.log(`[TAMV Economy] Action: ${action} for user: ${userId}`);

    // Generate transaction hash
    const hashInput = JSON.stringify({ action, userId, data, timestamp });
    const encoder = new TextEncoder();
    const hashData = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    let result: Record<string, unknown> = {};

    switch (action) {
      case "getBalance": {
        if (!userId) throw new Error("userId required");

        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("tamv_credits, reputation_score")
          .eq("id", userId)
          .single();

        if (error) throw error;

        result = {
          balance: profile?.tamv_credits || 0,
          reputation: profile?.reputation_score || 0,
          currency: "TC",
          timestamp,
        };
        break;
      }

      case "transfer": {
        if (!userId || !data?.recipientId || !data?.amount) {
          throw new Error("userId, recipientId and amount required");
        }

        // Get sender balance
        const { data: sender, error: senderError } = await supabaseClient
          .from("profiles")
          .select("tamv_credits")
          .eq("id", userId)
          .single();

        if (senderError) throw senderError;

        const senderBalance = sender?.tamv_credits || 0;
        if (senderBalance < data.amount) {
          throw new Error("Insufficient balance");
        }

        // Get recipient balance
        const { data: recipient, error: recipientError } = await supabaseClient
          .from("profiles")
          .select("tamv_credits")
          .eq("id", data.recipientId)
          .single();

        if (recipientError) throw recipientError;

        const recipientBalance = recipient?.tamv_credits || 0;

        // Update balances
        await supabaseClient
          .from("profiles")
          .update({ tamv_credits: senderBalance - data.amount })
          .eq("id", userId);

        await supabaseClient
          .from("profiles")
          .update({ tamv_credits: recipientBalance + data.amount })
          .eq("id", data.recipientId);

        // Record transactions
        await supabaseClient.from("tamv_credits_ledger").insert([
          {
            user_id: userId,
            transaction_type: "transfer_out",
            amount: -data.amount,
            balance_before: senderBalance,
            balance_after: senderBalance - data.amount,
            description: data.reason || "Transfer out",
            reference_id: data.recipientId,
            hash,
          },
          {
            user_id: data.recipientId,
            transaction_type: "transfer_in",
            amount: data.amount,
            balance_before: recipientBalance,
            balance_after: recipientBalance + data.amount,
            description: data.reason || "Transfer in",
            reference_id: userId,
            hash,
          },
        ]);

        result = {
          status: "completed",
          transactionId: hash.substring(0, 16),
          amount: data.amount,
          from: userId,
          to: data.recipientId,
          newBalance: senderBalance - data.amount,
          timestamp,
        };
        break;
      }

      case "reward": {
        if (!userId || !data?.amount) {
          throw new Error("userId and amount required");
        }

        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("tamv_credits, reputation_score, total_contributions")
          .eq("id", userId)
          .single();

        if (error) throw error;

        const currentBalance = profile?.tamv_credits || 0;
        const currentReputation = profile?.reputation_score || 0;
        const contributions = profile?.total_contributions || 0;

        // Update profile
        await supabaseClient
          .from("profiles")
          .update({
            tamv_credits: currentBalance + data.amount,
            reputation_score: currentReputation + (data.amount * 0.1),
            total_contributions: contributions + 1,
          })
          .eq("id", userId);

        // Record transaction
        await supabaseClient.from("tamv_credits_ledger").insert({
          user_id: userId,
          transaction_type: "reward",
          amount: data.amount,
          balance_before: currentBalance,
          balance_after: currentBalance + data.amount,
          description: data.reason || "System reward",
          hash,
        });

        result = {
          status: "rewarded",
          amount: data.amount,
          reason: data.reason,
          newBalance: currentBalance + data.amount,
          reputationBonus: data.amount * 0.1,
          timestamp,
        };
        break;
      }

      case "stake": {
        if (!userId || !data?.amount) {
          throw new Error("userId and amount required");
        }

        const { data: profile, error } = await supabaseClient
          .from("profiles")
          .select("tamv_credits")
          .eq("id", userId)
          .single();

        if (error) throw error;

        const currentBalance = profile?.tamv_credits || 0;
        if (currentBalance < data.amount) {
          throw new Error("Insufficient balance for staking");
        }

        // Deduct staked amount
        await supabaseClient
          .from("profiles")
          .update({ tamv_credits: currentBalance - data.amount })
          .eq("id", userId);

        // Record staking transaction
        await supabaseClient.from("tamv_credits_ledger").insert({
          user_id: userId,
          transaction_type: "stake",
          amount: -data.amount,
          balance_before: currentBalance,
          balance_after: currentBalance - data.amount,
          description: "Staking for governance power",
          hash,
        });

        result = {
          status: "staked",
          amount: data.amount,
          stakingPower: Math.sqrt(data.amount),
          unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedRewards: data.amount * 0.05,
          timestamp,
        };
        break;
      }

      case "getTransactions": {
        if (!userId) throw new Error("userId required");

        const { data: transactions, error } = await supabaseClient
          .from("tamv_credits_ledger")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        result = {
          transactions: transactions || [],
          count: transactions?.length || 0,
          timestamp,
        };
        break;
      }

      case "getLeaderboard": {
        const { data: leaderboard, error } = await supabaseClient
          .from("profiles")
          .select("id, username, full_name, avatar_url, tamv_credits, reputation_score, badges")
          .order("tamv_credits", { ascending: false })
          .limit(20);

        if (error) throw error;

        result = {
          leaderboard: leaderboard?.map((user, index) => ({
            rank: index + 1,
            ...user,
          })) || [],
          timestamp,
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        protocol: "TAMV_ECONOMY",
        version: "1.0.0",
        data: result,
        hash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[TAMV Economy] Error:", error);
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
