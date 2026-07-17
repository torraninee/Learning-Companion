// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the client (automatically reads process.env.GROQ_API_KEY)
const groq = new Groq();

// The function name 'POST' tells Next.js to handle HTTP POST requests here
export async function POST(request: Request) {
  try {
    // 1. Parse the incoming JSON body
    const { prompt } = await request.json();

    // 2. Call the Groq API using the active, highly-capable GPT-OSS model
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
    });

    // 3. Return a standard JSON response
    return NextResponse.json({ 
      text: completion.choices[0]?.message?.content || "No response" 
    });

  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: "Failed to fetch from Groq" }, { status: 500 });
  }
}