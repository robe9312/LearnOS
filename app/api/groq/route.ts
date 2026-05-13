import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

let groqClient: Groq | null = null;

function getGroq(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is required');
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export async function POST(req: Request) {
  const { prompt } = await req.json();
  try {
    const groq = getGroq();
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0].message.content;
    return NextResponse.json(JSON.parse(content || '{}'));
  } catch (error) {
    console.error("Groq API Error:", error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
