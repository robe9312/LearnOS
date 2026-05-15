import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { analyzeAndImprove } from '@/lib/ai/self-improvement';
import { db } from '@/lib/db';
import { improvements } from '@/src/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { z } from 'zod';

const selfImproveSchema = z.object({
  content: z.string().min(10).max(10000),
  context: z.record(z.string(), z.any()).optional(),
  mode: z.enum(['improve', 'correct', 'expand', 'simplify']).default('improve')
});

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Parsear y validar el body
    const body = await request.json();
    const validation = selfImproveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { content, context, mode } = validation.data;

    // 3. Ejecutar el motor de auto-mejora
    const result = await analyzeAndImprove(userId, content, {
      ...context,
      mode, // 'improve' | 'correct' | 'expand' | 'simplify'
      timestamp: new Date().toISOString()
    });

    // 4. Responder con el resultado
    return NextResponse.json({
      success: true,
      data: {
        analysis: result.analysis,
        suggestions: result.suggestions,
        nextSteps: result.nextSteps,
        metadata: {
          model: 'gemini-1.5-flash',
          processedAt: new Date().toISOString(),
          mode
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[self-improve] Error:', error);
    
    // Manejo de errores específico para Gemini
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process improvement request' },
      { status: 500 }
    );
  }
}

// 🔍 Endpoint para obtener historial de mejoras aplicadas
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const noteId = searchParams.get('noteId');

    const query = db
      .select()
      .from(improvements)
      .where(
        noteId
          ? and(eq(improvements.userId, userId), eq(improvements.sourceNoteId, noteId as string))
          : eq(improvements.userId, userId)
      )
      .orderBy(desc(improvements.appliedAt));

    const history = await query.limit(limit);

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('[self-improve:GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch improvement history' },
      { status: 500 }
    );
  }
}
