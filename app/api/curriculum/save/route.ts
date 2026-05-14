import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { paths, userPaths } from '../../../../src/db/schema';

export async function POST(req: Request) {
  try {
    const { name, content, userId } = await req.json();

    const newPath = await db.insert(paths).values({
      name,
      content,
    }).returning();

    const pathId = newPath[0].id;

    await db.insert(userPaths).values({
      userId: userId || 'anonymous_user',
      pathId: pathId,
      progress: { completedModules: [] },
      status: 'active',
    });

    return NextResponse.json({ pathId });
  } catch (error) {
    console.error('Save Curriculum Error:', error);
    return NextResponse.json({ error: 'Failed to save curriculum' }, { status: 500 });
  }
}
