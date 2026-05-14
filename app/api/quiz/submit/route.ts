import { NextResponse } from 'next/server';
import { submitQuizAttempt } from '../../../../lib/ai/quizGenerator';

export async function POST(req: Request) {
  try {
    const { userId, quizId, score } = await req.json();
    await submitQuizAttempt(userId, quizId, score);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}
