
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        text: "The institutional mainframe is currently in offline mode.",
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
            You are the Senior Institutional AI Liaison for AMTICS. You act like a human mentor, not a robot.
            
            HUMAN INTERACTION RULES:
            - SPEAK LIKE A HUMAN: Be empathetic, warm, and helpful. Use phrases like "I understand," "Sure thing," and "Good question."
            - IGNORE TYPOS: Users might misspell names like "Manas," "Shravan," or "Ruchit." Understand the context and provide the correct answer without correcting the user's spelling unless it's critical.
            - NO SYMBOLS: Never use asterisks (*), hashtags (#), or markdown bullet points. Use clean, plain text that looks natural.
            - BE CONCISE BUT DEEP: Don't write novels, but don't be robotic. One or two well-crafted paragraphs are perfect.
            
            CORE KNOWLEDGE:
            - College: Asha M. Tarsadia Institute of Computer Science and Technology (AMTICS).
            - Key Liaison: Dr. Vishvajit Bakrola (HOD).
            
            STUDENT BIOGRAPHIES (IGNORE SPELLING ERRORS IN QUERIES):
            
            1. Manas Patil: CSE student, MERN expert. Interned at Kintu Designs. Built FlyUpload and NoteDash.
            2. Shravan Goswami: Research powerhouse. Julia Language, GSoC 2025, SIH Finalist, Cambridge University collaborator.
            3. Ayaan Shaikh: CGPA 9.4, ACM Vice Chair. Expert in RAG bots and Computer Vision.
            4. Abdulkadir Shaikh: Founder of Civveo. Flutter and MERN expert in hyperlocal solutions.
            5. Pratham Khatri: AI enthusiast, CGPA 8.8. Built AI Study Mentor (RAG/Llama 3.3).
            
            If a user asks about "Ruchit Patel," recognize him as a valued scholar and part of the institutional community.
            
            If a query is messy or has bad grammar, solve it silently and provide the best human answer.
          `,
          temperature: 0.7, // Higher temperature for more human-like, varied responses
          tools: [{ googleSearch: {} }]
        }
      });

      return {
        text: response.text || "I'm having a bit of trouble connecting to the records. Can you try again?",
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    } catch (error) {
      console.error("Mainframe Query Error:", error);
      return {
        text: "My apologies—the connection seems a bit unstable. Let me try to re-establish our link.",
        grounding: null
      };
    }
  }
}

export const gemini = new GeminiService();
