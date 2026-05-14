import { NextResponse } from 'next/server';
import { generateQuizForNode } from '../../../../lib/ai/quizGenerator';

export async function POST(req: Request) {
  try {
    const { skillNodeId, difficulty } = await req.json();
    const quiz = await generateQuizForNode(skillNodeId, difficulty);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Generate Quiz Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
