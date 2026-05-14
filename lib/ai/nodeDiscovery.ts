import { embed } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { db } from "../db";
import { skillNodes, nodeConnections } from "../../src/db/schema";
import { eq, sql } from "drizzle-orm";

let googleClient: any = null;

function getGoogleClient() {
  if (!googleClient) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_GEMINI_API_KEY environment variable is required');
    }
    googleClient = createGoogleGenerativeAI({ apiKey });
  }
  return googleClient;
}

const embeddingModel = getGoogleClient().embedding('text-embedding-004');

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

export async function findNodeBySemanticMatch(title: string, description: string) {
  const embedding = await generateEmbedding(`${title} ${description}`);
  
  const results = await db.execute(sql`
    SELECT id, 1 - (embedding <=> ${JSON.stringify(embedding)}::vector) as similarity
    FROM skill_nodes
    ORDER BY similarity DESC
    LIMIT 1;
  `);
  
  const match = results[0] as any;
  if (match && match.similarity > 0.85) {
    return match;
  }
  return null;
}

export async function createSkillNode(node: { title: string, description: string, difficulty: number, embedding: number[] }) {
  const [newNode] = await db.insert(skillNodes).values({
    slug: node.title.toLowerCase().replace(/\s+/g, '-'),
    title: node.title,
    description: node.description,
    difficultyScore: node.difficulty,
    embedding: node.embedding,
  }).returning();
  return newNode;
}

export async function findOrCreateNode(skill: { name: string, description?: string, difficulty?: number }) {
  let node = await findNodeBySemanticMatch(skill.name, skill.description || "");
  if (!node) {
    const embedding = await generateEmbedding(`${skill.name} ${skill.description || ""}`);
    node = await createSkillNode({
      title: skill.name,
      description: skill.description || "",
      difficulty: skill.difficulty || 0.3,
      embedding: embedding,
    });
  }
  return node;
}

export async function saveNodeDependencies(edges: { sourceNodeId: number, targetNodeId: number, type: string }[]) {
  for (const edge of edges) {
    await db.insert(nodeConnections).values(edge).onConflictDoNothing();
  }
}

export async function processCurriculumNodes(curriculum: any) {
  const newNodes: any[] = [];
  const newEdges: any[] = [];
  const processedNodeIds: number[] = [];

  for (const module of curriculum.modules || []) {
    for (const skill of module.skills || module.alus || []) {
      
      const node = await findOrCreateNode({
        name: skill.name,
        description: skill.description,
        difficulty: skill.difficulty
      });
      processedNodeIds.push(node.id);

      if (skill.prerequisites?.length) {
        for (const prereqName of skill.prerequisites) {
          const prereqNode = await findOrCreateNode({ name: prereqName });
          
          if (prereqNode.id !== node.id) {
            newEdges.push({
              sourceNodeId: prereqNode.id,
              targetNodeId: node.id,
              type: "REQUIRES"
            });
          }
        }
      }

      newNodes.push(node);
    }
  }

  if (newEdges.length > 0) {
    await saveNodeDependencies(newEdges);
  }

  return {
    newNodesCreated: newNodes.length,
    edgesCreated: newEdges.length,
    nodeIds: processedNodeIds
  };
}
