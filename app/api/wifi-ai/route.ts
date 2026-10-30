import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, systemInstruction } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are NexusWave AI, an expert wireless network engineer specialized in enterprise Wi-Fi 6/7, WPA3 security protocols, fiber optic backhauls (Totalplay, Megacable, CFE, Go Wireless), channel optimization, and network troubleshooting. Provide concise, expert, actionable technical advice in Spanish.",
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI network response" },
      { status: 500 }
    );
  }
}
