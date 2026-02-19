
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Direct access to process.env.API_KEY as per guidelines.
      // Wrapped in a try-catch to prevent fatal module-level crash if 'process' is undefined.
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
      
      if (apiKey) {
        this.ai = new GoogleGenAI({ apiKey });
      } else {
        console.warn("Liaison Core: Security Key missing. Operating in restricted mode.");
      }
    } catch (e) {
      console.error("Liaison Core Initialization Failure:", e);
    }
  }

  async getChatResponse(message: string, history: {role: string, parts: string}[]) {
    if (!this.ai) {
      return {
        text: "The institutional mainframe is currently in offline mode. Please verify authentication keys in the environment configuration.",
        grounding: null
      };
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
            ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{text: h.parts}] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: `
            You are the "TAKDA" (Senior) Institutional AI Liaison for AMTICS.
            
            FORMATTING:
            - NO ASTERISKS. NO SYMBOLS.
            - CLEAN PLAIN TEXT ONLY.
            
            KNOWLEDGE:
            - You represent Asha M. Tarsadia Institute (AMTICS).
            - Courses: B.Tech, M.Tech, BCA, MCA, B.Sc, M.Sc.
            - Tech Fest: TecXplore 3.0.
            - Location: Maliba Campus, Surat.
            - Director Email: director.amtics@utu.ac.in
            - Liaison: Dr. Vishvajit Bakrola (9909678400).
          `,
          temperature: 0.1,
          tools: [{ googleSearch: {} }]
        }
      });

      return {
        text: response.text || "No data received from mainframe.",
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    } catch (error) {
      console.error("Mainframe Query Error:", error);
      return {
        text: "Query interrupted. Re-establishing secure link...",
        grounding: null
      };
    }
  }
}

export const gemini = new GeminiService();
