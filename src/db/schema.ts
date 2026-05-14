import { pgTable, serial, text, jsonb, timestamp, doublePrecision, uuid } from 'drizzle-orm/pg-core';

export const skillNodes = pgTable('skill_nodes', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  prerequisites: jsonb('prerequisites'), // Array of slugs
  difficultyScore: doublePrecision('difficulty_score').default(0),
});

export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  skillNodeId: serial('skill_node_id').references(() => skillNodes.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull(), // article, video, documentation
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const paths = pgTable('paths', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  content: jsonb('content').notNull(), // The generated curriculum structure
  createdAt: timestamp('created_at').defaultNow(),
});

export const userPaths = pgTable('user_paths', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk userId
  pathId: serial('path_id').references(() => paths.id),
  progress: jsonb('progress'), // Detailed progress
  status: text('status').default('active'), // active, completed, abandoned
});
