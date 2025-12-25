import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DAORequest {
  action: "getProposals" | "createProposal" | "vote" | "execute" | "getVotingPower";
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

    const { action, userId, data }: DAORequest = await req.json();
    const timestamp = new Date().toISOString();

    console.log(`[DAO Governance] Action: ${action} by user: ${userId}`);

    // Generate action hash
    const hashInput = JSON.stringify({ action, userId, data, timestamp });
    const encoder = new TextEncoder();
    const hashData = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", hashData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    let result: Record<string, unknown> = {};

    switch (action) {
      case "getProposals": {
        const status = data?.status as string || null;
        
        let query = supabaseClient
          .from("dao_proposals")
          .select(`
            *,
            author:profiles!dao_proposals_author_id_fkey(username, full_name, avatar_url)
          `)
          .order("created_at", { ascending: false });

        if (status) {
          query = query.eq("status", status);
        }

        const { data: proposals, error } = await query.limit(50);

        if (error) throw error;

        // Get vote counts
        const proposalsWithVotes = await Promise.all(
          (proposals || []).map(async (proposal) => {
            const { data: votes } = await supabaseClient
              .from("dao_votes")
              .select("vote_type, voting_power")
              .eq("proposal_id", proposal.id);

            let votesFor = 0;
            let votesAgainst = 0;
            
            votes?.forEach(vote => {
              if (vote.vote_type === "for") {
                votesFor += vote.voting_power || 1;
              } else if (vote.vote_type === "against") {
                votesAgainst += vote.voting_power || 1;
              }
            });

            return {
              ...proposal,
              votes_for: votesFor,
              votes_against: votesAgainst,
              total_votes: votes?.length || 0,
            };
          })
        );

        result = {
          proposals: proposalsWithVotes,
          count: proposalsWithVotes.length,
          timestamp,
        };
        break;
      }

      case "createProposal": {
        if (!userId || !data?.title || !data?.description || !data?.category) {
          throw new Error("userId, title, description, and category required");
        }

        // Check if user has voting power
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("tamv_credits, reputation_score")
          .eq("id", userId)
          .single();

        const votingPower = Math.sqrt((profile?.tamv_credits || 0) + (profile?.reputation_score || 0));
        
        if (votingPower < 1) {
          throw new Error("Insufficient voting power to create proposals");
        }

        const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

        const { data: proposal, error } = await supabaseClient
          .from("dao_proposals")
          .insert({
            title: data.title,
            description: data.description,
            category: data.category,
            author_id: userId,
            status: "active",
            quorum: Math.ceil(votingPower * 10), // Dynamic quorum
            deadline,
          })
          .select()
          .single();

        if (error) throw error;

        result = {
          proposal,
          message: "Proposal created successfully",
          timestamp,
        };

        // Log proposal creation
        await supabaseClient.from("audit_logs").insert({
          event_type: "DAO_PROPOSAL_CREATED",
          action: "createProposal",
          actor_id: userId,
          target_id: proposal.id,
          details: { title: data.title, category: data.category },
          hash,
          severity: "info",
        });
        break;
      }

      case "vote": {
        if (!userId || !data?.proposalId || !data?.voteType) {
          throw new Error("userId, proposalId, and voteType required");
        }

        // Check if proposal is active
        const { data: proposal, error: proposalError } = await supabaseClient
          .from("dao_proposals")
          .select("status, deadline")
          .eq("id", data.proposalId)
          .single();

        if (proposalError) throw proposalError;

        if (proposal.status !== "active") {
          throw new Error("Proposal is not active");
        }

        if (new Date(proposal.deadline) < new Date()) {
          throw new Error("Voting period has ended");
        }

        // Get user's voting power
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("tamv_credits, reputation_score")
          .eq("id", userId)
          .single();

        const votingPower = Math.ceil(Math.sqrt((profile?.tamv_credits || 0) + (profile?.reputation_score || 0)));

        // Check if already voted
        const { data: existingVote } = await supabaseClient
          .from("dao_votes")
          .select("id")
          .eq("proposal_id", data.proposalId)
          .eq("voter_id", userId)
          .single();

        if (existingVote) {
          throw new Error("Already voted on this proposal");
        }

        // Cast vote
        const { error: voteError } = await supabaseClient
          .from("dao_votes")
          .insert({
            proposal_id: data.proposalId,
            voter_id: userId,
            vote_type: data.voteType,
            voting_power: votingPower,
            reason: data.reason,
          });

        if (voteError) throw voteError;

        result = {
          status: "voted",
          proposalId: data.proposalId,
          voteType: data.voteType,
          votingPower,
          timestamp,
        };

        // Log vote
        await supabaseClient.from("audit_logs").insert({
          event_type: "DAO_VOTE",
          action: "vote",
          actor_id: userId,
          target_id: data.proposalId as string,
          details: { voteType: data.voteType, votingPower },
          hash,
          severity: "info",
        });
        break;
      }

      case "execute": {
        if (!data?.proposalId) {
          throw new Error("proposalId required");
        }

        // Get proposal with votes
        const { data: proposal, error: proposalError } = await supabaseClient
          .from("dao_proposals")
          .select("*")
          .eq("id", data.proposalId)
          .single();

        if (proposalError) throw proposalError;

        if (proposal.status !== "active") {
          throw new Error("Proposal is not active");
        }

        if (new Date(proposal.deadline) > new Date()) {
          throw new Error("Voting period has not ended");
        }

        // Get votes
        const { data: votes } = await supabaseClient
          .from("dao_votes")
          .select("vote_type, voting_power")
          .eq("proposal_id", data.proposalId);

        let votesFor = 0;
        let votesAgainst = 0;
        
        votes?.forEach(vote => {
          if (vote.vote_type === "for") {
            votesFor += vote.voting_power || 1;
          } else if (vote.vote_type === "against") {
            votesAgainst += vote.voting_power || 1;
          }
        });

        const totalVotes = votesFor + votesAgainst;
        const passed = totalVotes >= proposal.quorum && votesFor > votesAgainst;
        const newStatus = passed ? "passed" : "rejected";

        // Update proposal status
        await supabaseClient
          .from("dao_proposals")
          .update({
            status: newStatus,
            votes_for: votesFor,
            votes_against: votesAgainst,
            executed_at: passed ? timestamp : null,
            execution_hash: passed ? hash : null,
          })
          .eq("id", data.proposalId);

        result = {
          status: newStatus,
          proposalId: data.proposalId,
          votesFor,
          votesAgainst,
          quorumMet: totalVotes >= proposal.quorum,
          executionHash: passed ? hash : null,
          timestamp,
        };

        // Log execution
        await supabaseClient.from("audit_logs").insert({
          event_type: "DAO_EXECUTION",
          action: "execute",
          target_id: data.proposalId as string,
          details: result,
          hash,
          severity: passed ? "info" : "warn",
        });
        break;
      }

      case "getVotingPower": {
        if (!userId) throw new Error("userId required");

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("tamv_credits, reputation_score, total_contributions")
          .eq("id", userId)
          .single();

        const credits = profile?.tamv_credits || 0;
        const reputation = profile?.reputation_score || 0;
        const contributions = profile?.total_contributions || 0;

        // Voting power formula
        const votingPower = Math.ceil(Math.sqrt(credits + reputation) + (contributions * 0.1));

        result = {
          votingPower,
          breakdown: {
            fromCredits: Math.sqrt(credits),
            fromReputation: Math.sqrt(reputation),
            fromContributions: contributions * 0.1,
          },
          canCreateProposals: votingPower >= 1,
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
        protocol: "DAO_GOVERNANCE",
        version: "1.0.0",
        data: result,
        hash,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[DAO Governance] Error:", error);
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
