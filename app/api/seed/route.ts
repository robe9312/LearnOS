import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { skillNodes } from '../../../src/db/schema';

export async function POST() {
  try {
    // Basic seed data for JS/Frontend domain
    const seedData = [
      { slug: 'javascript', title: 'JavaScript Fundamentals', description: 'Core JS concepts', prerequisites: [], difficultyScore: 0.1 },
      { slug: 'typescript', title: 'TypeScript', description: 'Type-safe JS', prerequisites: ['javascript'], difficultyScore: 0.3 },
      { slug: 'react', title: 'React', description: 'Frontend Library', prerequisites: ['javascript', 'typescript'], difficultyScore: 0.5 },
    ];

    await db.insert(skillNodes).values(seedData);
    
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
