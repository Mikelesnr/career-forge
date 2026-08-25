import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: Request) {
  try {
    const { prompt, context } = await request.json()

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert career assistant integrated into CareerForge, a job tracking app built for a full-stack software developer. 
              Here is context regarding the user's active applications and records:
              ${JSON.stringify(context)}
              
              User Question: ${prompt}`,
            },
          ],
        },
      ],
    })

    return NextResponse.json({ reply: response.text })
  } catch {
    return NextResponse.json({ error: 'Chat processing failed' }, { status: 500 })
  }
}