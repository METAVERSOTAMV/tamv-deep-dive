import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AudioSession {
  id: string;
  userId: string;
  emotionalState: {
    valence: number;
    arousal: number;
    dominance: number;
  };
  spatialConfig: {
    listenerPosition: { x: number; y: number; z: number };
    roomSize: "small" | "medium" | "large" | "infinite";
    reverbAmount: number;
  };
}

interface SpeechRequest {
  text: string;
  voice?: "isabella" | "anubis" | "neutral";
  emotionalTone?: "calm" | "excited" | "serious" | "warm";
  speed?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    let result: unknown;

    switch (action) {
      case "createSession":
        const session: AudioSession = {
          id: crypto.randomUUID(),
          userId: params.userId,
          emotionalState: {
            valence: 0.5,
            arousal: 0.5,
            dominance: 0.5
          },
          spatialConfig: {
            listenerPosition: { x: 0, y: 0, z: 0 },
            roomSize: params.roomSize || "medium",
            reverbAmount: 0.3
          }
        };
        
        result = { session };
        break;

      case "updateEmotionalState":
        result = {
          updated: true,
          emotionalState: params.emotionalState,
          audioAdjustments: {
            filterFrequency: calculateFilterFromEmotion(params.emotionalState),
            reverbMix: calculateReverbFromEmotion(params.emotionalState),
            spatialWidth: calculateWidthFromEmotion(params.emotionalState)
          }
        };
        break;

      case "generateSpeech":
        const speechReq = params as SpeechRequest;
        
        // In a real implementation, this would call a TTS service
        result = {
          generated: true,
          text: speechReq.text,
          voice: speechReq.voice || "isabella",
          emotionalTone: speechReq.emotionalTone || "warm",
          duration: estimateSpeechDuration(speechReq.text, speechReq.speed || 1),
          audioUrl: null, // Would be actual audio URL
          metadata: {
            sampleRate: 44100,
            channels: 2,
            format: "wav"
          }
        };
        break;

      case "getSpatialConfig":
        result = {
          config: {
            hrtfEnabled: true,
            maxDistance: 100,
            rolloffFactor: 1,
            dopplerEnabled: false,
            distanceModel: "inverse"
          }
        };
        break;

      case "processAudio":
        result = {
          processed: true,
          effects: params.effects || [],
          outputFormat: "wav",
          processingTime: Math.random() * 100 + 50 // Simulated processing time
        };
        break;

      case "getPresets":
        result = {
          presets: [
            { id: "ambient", name: "Ambiente Calmado", reverb: 0.6, filter: 2000 },
            { id: "concert", name: "Concierto XR", reverb: 0.8, filter: 8000 },
            { id: "intimate", name: "Conversación Íntima", reverb: 0.2, filter: 4000 },
            { id: "cosmic", name: "Espacio Cósmico", reverb: 0.9, filter: 1500 },
            { id: "forest", name: "Bosque Natural", reverb: 0.4, filter: 3000 }
          ]
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
    console.error("KAOS Audio Error:", error);
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

// Helper functions
function calculateFilterFromEmotion(state: { valence: number; arousal: number }): number {
  // Higher arousal = higher frequency cutoff
  // Higher valence = brighter sound
  return 1000 + (state.arousal * 4000) + (state.valence * 2000);
}

function calculateReverbFromEmotion(state: { valence: number; arousal: number }): number {
  // Lower arousal = more reverb (spacious, calm)
  // Lower valence = more reverb (melancholic)
  return Math.max(0.1, 0.8 - (state.arousal * 0.5) - (state.valence * 0.2));
}

function calculateWidthFromEmotion(state: { valence: number; dominance: number }): number {
  // Higher dominance = wider spatial field
  // Higher valence = more open sound
  return 0.5 + (state.dominance * 0.3) + (state.valence * 0.2);
}

function estimateSpeechDuration(text: string, speed: number): number {
  // Rough estimate: 150 words per minute at normal speed
  const words = text.split(/\s+/).length;
  const minutes = words / (150 * speed);
  return Math.ceil(minutes * 60 * 1000); // Return milliseconds
}
