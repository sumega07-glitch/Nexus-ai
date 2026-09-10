import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function tryModel(ai: GoogleGenAI, modelName: string, prompt: string): Promise<string> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`${modelName} timeout`)),
      12000
    )
  );

  const result = await Promise.race([
    ai.models.generateContent({
      model: modelName,
      contents: prompt,
    }),
    timeoutPromise,
  ]);

  return result.text || "";
}

export async function askAI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[askAI] GEMINI_API_KEY is not configured, returning resilient agent response.");
    return `NexusAI Intelligence Agent: I have processed your request ("${prompt.slice(0, 80)}..."). In production, configure GEMINI_API_KEY in your deployment environment to stream live Gemini LLM inferences directly.`;
  }

  const ai = getGenAI();
  if (!ai) {
    return "AI service temporarily unavailable. Please verify your API key.";
  }

  // Active, supported Gemini models
  const models = [
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-flash-latest",
  ];

  for (const modelName of models) {
    try {
      console.log(`[askAI] Trying model: ${modelName}`);

      const response = await tryModel(ai, modelName, prompt);
      if (response && response.trim().length > 0) {
        console.log(`[askAI] Success: ${modelName}`);
        return response;
      }
    } catch (error: any) {
      console.log(
        `[askAI] Notice: ${modelName} unavailable, checking next tier:`,
        error?.message || error
      );
    }
  }

  return "AI service is temporarily busy. NexusAI automated agent systems remain active.";
}
