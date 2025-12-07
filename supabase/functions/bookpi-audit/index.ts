import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuditEvent {
  eventType: string;
  entityType: string;
  entityId: string;
  userId?: string;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

// Generate SHA-512 hash for audit trail
async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-512", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
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
    const { action, events, query } = body;

    let result: unknown;

    switch (action) {
      case "logEvent":
        const event = body.event as AuditEvent;
        const timestamp = new Date().toISOString();
        
        // Create hash of the event data
        const eventData = JSON.stringify({
          ...event,
          timestamp
        });
        const hash = await generateHash(eventData);

        // Log to BookPI audit trail
        console.log(`[BookPI] Event logged:`, {
          hash: hash.substring(0, 16) + "...",
          eventType: event.eventType,
          entityType: event.entityType,
          action: event.action,
          timestamp
        });

        result = {
          logged: true,
          hash,
          timestamp,
          eventId: crypto.randomUUID()
        };
        break;

      case "logBatch":
        const batchEvents = events as AuditEvent[];
        const batchResults = await Promise.all(
          batchEvents.map(async (evt) => {
            const ts = new Date().toISOString();
            const data = JSON.stringify({ ...evt, timestamp: ts });
            const h = await generateHash(data);
            return {
              eventId: crypto.randomUUID(),
              hash: h,
              timestamp: ts
            };
          })
        );
        
        result = {
          logged: true,
          count: batchResults.length,
          events: batchResults
        };
        break;

      case "verifyHash":
        // Verify integrity of an event by comparing hashes
        const { originalHash, eventData: verifyData } = body;
        const computedHash = await generateHash(JSON.stringify(verifyData));
        
        result = {
          verified: originalHash === computedHash,
          originalHash,
          computedHash: computedHash.substring(0, 16) + "..."
        };
        break;

      case "getAuditTrail":
        // In a real implementation, this would query from a database
        result = {
          trail: [],
          message: "Audit trail query - implement with actual database storage"
        };
        break;

      case "generateReport":
        const { startDate, endDate, entityType: reportEntity } = query || {};
        
        result = {
          report: {
            generatedAt: new Date().toISOString(),
            period: { startDate, endDate },
            entityType: reportEntity,
            summary: {
              totalEvents: 0,
              byType: {},
              byAction: {}
            }
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
    console.error("BookPI Audit Error:", error);
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
