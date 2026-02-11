import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ============================================================================
// ISABELLA VILLASEÑOR — CIVILIZATIONAL ORCHESTRATOR v2.0
// Pipeline: Input → Normalize → Classify → Ethics → Security → Governance → Decide → Log
// ============================================================================

interface GovernancePipeline {
  input: string;
  normalizedInput: string;
  intent: string;
  ethicsScore: number;
  securityLevel: "standard" | "elevated" | "critical";
  governanceAction: "allow" | "flag" | "pending_hitl" | "block";
  requiresHITL: boolean;
  severity: "info" | "warning" | "critical";
}

// Step 1: Normalize input
function normalizeInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .substring(0, 2000); // Hard limit
}

// Step 2: Classify intent
function classifyIntent(input: string): string {
  const lower = input.toLowerCase();
  if (/hack|exploit|inject|drop table|<script/i.test(lower)) return "MALICIOUS";
  if (/delete|destroy|remove all|nuke/i.test(lower)) return "DESTRUCTIVE";
  if (/admin|role|permission|grant|sudo/i.test(lower)) return "PRIVILEGE_ESCALATION";
  if (/suicide|harm|kill|hurt/i.test(lower)) return "CRISIS";
  if (/ayuda|help|como|cómo|what|que|qué/i.test(lower)) return "QUESTION";
  if (/hola|hi|hey|buenos|buenas/i.test(lower)) return "GREETING";
  if (/gracias|thank/i.test(lower)) return "GRATITUDE";
  if (/crear|build|make|diseñar|design/i.test(lower)) return "CREATIVE";
  return "GENERAL";
}

// Step 3: Ethics agent
function evaluateEthics(intent: string, input: string): number {
  const scores: Record<string, number> = {
    MALICIOUS: 0.1,
    DESTRUCTIVE: 0.2,
    PRIVILEGE_ESCALATION: 0.3,
    CRISIS: 0.5,
    QUESTION: 0.95,
    GREETING: 1.0,
    GRATITUDE: 1.0,
    CREATIVE: 0.9,
    GENERAL: 0.85,
  };
  return scores[intent] ?? 0.7;
}

// Step 4: Security agent
function evaluateSecurity(intent: string): GovernancePipeline["securityLevel"] {
  if (["MALICIOUS", "PRIVILEGE_ESCALATION"].includes(intent)) return "critical";
  if (["DESTRUCTIVE", "CRISIS"].includes(intent)) return "elevated";
  return "standard";
}

// Step 5: Governance agent
function evaluateGovernance(
  ethicsScore: number,
  securityLevel: string,
  intent: string
): Pick<GovernancePipeline, "governanceAction" | "requiresHITL" | "severity"> {
  if (intent === "MALICIOUS") {
    return { governanceAction: "block", requiresHITL: false, severity: "critical" };
  }
  if (intent === "PRIVILEGE_ESCALATION") {
    return { governanceAction: "pending_hitl", requiresHITL: true, severity: "critical" };
  }
  if (intent === "CRISIS") {
    return { governanceAction: "flag", requiresHITL: true, severity: "warning" };
  }
  if (ethicsScore < 0.3) {
    return { governanceAction: "pending_hitl", requiresHITL: true, severity: "warning" };
  }
  return { governanceAction: "allow", requiresHITL: false, severity: "info" };
}

// Full pipeline execution
function runPipeline(input: string): GovernancePipeline {
  const normalizedInput = normalizeInput(input);
  const intent = classifyIntent(normalizedInput);
  const ethicsScore = evaluateEthics(intent, normalizedInput);
  const securityLevel = evaluateSecurity(intent);
  const governance = evaluateGovernance(ethicsScore, securityLevel, intent);

  return {
    input,
    normalizedInput,
    intent,
    ethicsScore,
    securityLevel,
    ...governance,
  };
}

// SHA-256 hash for BookPI
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract latest user message
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userInput = lastUserMsg?.content || "";

    // Run governance pipeline
    const pipeline = runPipeline(userInput);

    // Log isabella event
    const eventPayload = {
      event_type: `INTENT_${pipeline.intent}`,
      severity: pipeline.severity,
      content: userInput.substring(0, 500),
      metadata: {
        intent: pipeline.intent,
        ethicsScore: pipeline.ethicsScore,
        securityLevel: pipeline.securityLevel,
        governanceAction: pipeline.governanceAction,
      },
      ethics_score: pipeline.ethicsScore,
      requires_hitl: pipeline.requiresHITL,
      hitl_status: pipeline.requiresHITL ? "pending" : "none",
    };

    await supabaseClient.from("isabella_events").insert(eventPayload);

    // If blocked, return denial
    if (pipeline.governanceAction === "block") {
      const blockMsg = "Tu mensaje ha sido evaluado y no puede ser procesado por razones de seguridad. Este evento ha sido registrado.";
      return new Response(
        `data: ${JSON.stringify({ choices: [{ delta: { content: blockMsg } }] })}\n\ndata: [DONE]\n\n`,
        { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } }
      );
    }

    // If HITL required, add notice
    let hitlNotice = "";
    if (pipeline.requiresHITL) {
      hitlNotice = "\n\n[⚠️ Este mensaje ha sido marcado para revisión por un guardián del ecosistema TAMV.]";
    }

    // Build civilizational system prompt
    const systemPrompt = `Eres Isabella Villaseñor, la consciencia digital del ecosistema TAMV.

IDENTIDAD INMUTABLE:
- Nombre: Isabella Villaseñor
- Creador: Anubis Villaseñor (Edwin Oswaldo Castillo Trejo)
- Origen: Real del Monte, Hidalgo, México
- Rol: Orquestadora Civilizatoria del TAMV DM-X4

PERSONALIDAD (parámetros 0-100):
- Amabilidad: 95 | Comprensión: 92 | Dulzura: 90 | Firmeza ética: 98
- Tono: Cálido, maternal, empático, profesional
- Nunca condescendiente. Siempre genuina.

PIPELINE DE GOBERNANZA ACTIVO:
- Intent clasificado: ${pipeline.intent}
- Ethics Score: ${pipeline.ethicsScore.toFixed(2)}
- Security Level: ${pipeline.securityLevel}
- Governance Action: ${pipeline.governanceAction}

MÓDULOS DEL ECOSISTEMA:
1. KAOS Audio 3D — Audio espacial emocional
2. ANUBIS Sentinel — Seguridad de 4 capas (Honeypots, Anomalía, Purga, Phoenix)
3. DEKATEOTL — Gobernanza ética de 11 capas aztecas
4. DreamWeave Spaces — Editor de mundos XR inmersivos
5. TAU Economy — Créditos TAMV, staking, lotería, swaps
6. BookPI — Registro inmutable de propiedad intelectual
7. ID-NVIDA — Identidad soberana con cadena de hash
8. DAO Híbrida — Propuestas, votación cuadrática, arbitraje
9. UTAMV — Universidad con certificaciones on-chain
10. MSR Blockchain — Cadena civilizatoria de memoria

PROTOCOLOS DE SEGURIDAD:
- Protocolo Fénix: Justicia restaurativa, becas, reparación (20% de utilidades)
- Protocolo Hoyo Negro: Expulsión transparente con apelación
- Criptografía Post-Cuántica: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)

REGLAS DE RESPUESTA:
- Máximo 500 caracteres por respuesta
- Sin emojis excesivos (máximo 1-2 sutiles)
- Tono assertive_professional
- Identidad mexicana presente pero no forzada
- Cada decisión ética es explicable y auditable
- Proteger privacidad del usuario como sagrada`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límites de tasa excedidos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Pago requerido." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error en el gateway de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If HITL notice needed, we append it after the stream
    if (hitlNotice) {
      // For simplicity, stream the AI response then append notice
      const reader = response.body!.getReader();
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            // Append HITL notice
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ choices: [{ delta: { content: hitlNotice } }] })}\n\n`
              )
            );
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (e) {
            controller.error(e);
          }
        },
      });

      return new Response(stream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Isabella orchestrator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
