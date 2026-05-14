import { pgTable, serial, text, jsonb, timestamp, doublePrecision, primaryKey, customType, integer, boolean } from 'drizzle-orm/pg-core';

// PostgreSQL vector type placeholder for pgvector
const vector = customType<{ data: number[] }>({
  dataType() {
    return 'vector(1536)';
  },
});

export const users = pgTable("users", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text("name"),
  email:         text("email").unique(),
  emailVerified: timestamp("email_verified"),
  image:         text("image"),
})

export const accounts = pgTable("accounts", {
  userId:            text("user_id").references(() => users.id, { onDelete: "cascade" }),
  type:              text("type").notNull(),
  provider:          text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token:     text("refresh_token"),
  access_token:      text("access_token"),
  expires_at:        integer("expires_at"),
  token_type:        text("token_type"),
  scope:             text("scope"),
  id_token:          text("id_token"),
  session_state:     text("session_state"),
}, (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })])

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId:       text("user_id").references(() => users.id, { onDelete: "cascade" }),
  expires:      timestamp("expires").notNull(),
})

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token:      text("token").notNull(),
  expires:    timestamp("expires").notNull(),
}, (t) => [primaryKey({ columns: [t.identifier, t.token] })])

export const skillNodes = pgTable('skill_nodes', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  difficultyScore: doublePrecision('difficulty_score').default(0),
  embedding: vector('embedding'), // New vector column for embeddings
});

// Tabla intermedia para definir el grafo (dependencias)
export const nodeConnections = pgTable('node_connections', {
  sourceNodeId: serial('source_node_id').references(() => skillNodes.id),
  targetNodeId: serial('target_node_id').references(() => skillNodes.id),
  type: text('type').notNull(), // 'prerequisite', 'recommends', 'alternative'
}, (t) => ({
  pk: primaryKey({ columns: [t.sourceNodeId, t.targetNodeId] }),
}));

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  skillNodeId: serial('skill_node_id').references(() => skillNodes.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // article, video, documentation
  createdAt: timestamp('created_at').defaultNow(),
});

// NUEVO: Seguimiento de maestría (Capas de conocimiento del usuario)
export const nodeMastery = pgTable('node_mastery', {
  userId: text('user_id').notNull(),
  nodeId: serial('node_id').references(() => skillNodes.id),
  masteryLevel: doublePrecision('mastery_level').default(0), // 0.0 - 1.0
  lastAssessment: timestamp('last_assessment').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.nodeId] }),
}));

export const paths = pgTable('paths', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  content: jsonb('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userPaths = pgTable('user_paths', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  pathId: serial('path_id').references(() => paths.id),
  progress: jsonb('progress'),
  status: text('status').default('active'),
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  skillNodeId: serial('skill_node_id').references(() => skillNodes.id),
  difficultyLevel: doublePrecision('difficulty_level').default(0), // 0.0 (easy) to 1.0 (hard)
});

export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: serial('quiz_id').references(() => quizzes.id),
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // Array of options
  correctAnswer: jsonb('correct_answer').notNull(), // Or index
});

export const userQuizAttempts = pgTable('user_quiz_attempts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  quizId: serial('quiz_id').references(() => quizzes.id),
  score: doublePrecision('score').notNull(), // 0.0 - 1.0
  completedAt: timestamp('completed_at').defaultNow(),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  aiSuggestions: jsonb("ai_suggestions"),
  improvementScore: integer("improvement_score"),
  tags: text("tags").array(), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  synced: boolean("synced").default(false),
});

export const learningPatterns = pgTable("learning_patterns", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  actionType: text("action_type").notNull(),
  context: jsonb("context"),
  outcome: text("outcome"),
  aiFeedback: text("ai_feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const improvements = pgTable("improvements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  sourceNoteId: text("source_note_id").references(() => notes.id),
  originalContent: text("original_content"),
  improvedContent: text("improved_content"),
  aiModel: text("ai_model"),
  appliedAt: timestamp("applied_at").defaultNow(),
});
