import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { paths, userPaths } from '../../../../src/db/schema';
import { processCurriculumNodes } from '../../../../lib/ai/nodeDiscovery';

export async function POST(req: Request) {
  try {
    const { name, content, userId } = await req.json();

    // 1. Ejecutar Autodescubrimiento
    const discoveryResult = await processCurriculumNodes(content);
    console.log(`📊 Autodescubrimiento: ${discoveryResult.newNodesCreated} nodos nuevos | ${discoveryResult.edgesCreated} relaciones creadas`);

    // 2. Guardar el currículo
    const newPath = await db.insert(paths).values({
      name,
      content: { ...content, discoveryResult },
    }).returning();

    const pathId = newPath[0].id;

    await db.insert(userPaths).values({
      userId: userId || 'anonymous_user',
      pathId: pathId,
      progress: { completedModules: [] },
      status: 'active',
    });

    return NextResponse.json({ pathId, discoveryResult });
  } catch (error) {
    console.error('Save Curriculum Error:', error);
    return NextResponse.json({ error: 'Failed to save curriculum' }, { status: 500 });
  }
}
