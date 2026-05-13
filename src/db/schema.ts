import { pgTable, text, timestamp, uuid, integer, real, jsonb, primaryKey } from 'drizzle-orm/pg-core';

// Grafo de Conocimiento: Habilidades/Nodos
export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'), // e.g., 'Frontend', 'Backend', 'Foundations'
  difficulty: real('difficulty').default(0.5), // 0 to 1
  createdAt: timestamp('created_at').defaultNow(),
});

// Relaciones de Dependencia (Edges)
export const skillDependencies = pgTable('skill_dependencies', {
  skillId: uuid('skill_id').references(() => skills.id),
  dependsOnId: uuid('depends_on_id').references(() => skills.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.skillId, table.dependsOnId] }),
}));

// Unidades Atómicas de Aprendizaje (ALUs)
export const alus = pgTable('alus', {
  id: uuid('id').defaultRandom().primaryKey(),
  skillId: uuid('skill_id').references(() => skills.id),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'video', 'article', 'book', 'quiz'
  contentUrl: text('content_url').notNull(),
  provider: text('provider'), // 'YouTube', 'StackExchange', etc.
  metadata: jsonb('metadata'), // duration, views, rating, etc.
  embedding: text('embedding'), // Placeholder for pgvector or semantic search
  difficultyScore: real('difficulty_score'),
  isVerified: integer('is_verified').default(0), // 0 or 1
  createdAt: timestamp('created_at').defaultNow(),
});

// Progreso del Usuario
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').notNull(),
  skillId: uuid('skill_id').references(() => skills.id),
  masteryLevel: real('mastery_level').default(0), // 0 to 1
  status: text('status').default('started'), // 'started', 'completed', 'gap'
  lastActivity: timestamp('last_activity').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.skillId] }),
}));

// Checkpoints / Quizzes
export const checkpoints = pgTable('checkpoints', {
  id: uuid('id').defaultRandom().primaryKey(),
  aluId: uuid('alu_id').references(() => alus.id),
  questionData: jsonb('question_data').notNull(), // array of questions/answers
  passingScore: real('passing_score').default(0.7),
});
