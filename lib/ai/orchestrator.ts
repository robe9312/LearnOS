import { db } from '../db';
import { skillNodes, nodeConnections, nodeMastery } from '../../src/db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Módulo central que encapsula la lógica pedagógica,
 * reemplazando la lógica embebida en la UI.
 */

export async function getPrerequisitesForNode(nodeId: number) {
  const connections = await db.select()
    .from(nodeConnections)
    .where(and(
      eq(nodeConnections.targetNodeId, nodeId),
      eq(nodeConnections.type, 'prerequisite')
    ));
  
  return connections.map(c => c.sourceNodeId);
}

export async function getUserMastery(userId: string, nodeId: number) {
  const [mastery] = await db.select()
    .from(nodeMastery)
    .where(and(
      eq(nodeMastery.userId, userId),
      eq(nodeMastery.nodeId, nodeId)
    ));
    
  return (mastery?.masteryLevel ?? 0) as number;
}

/**
 * Lógica central de Gap Detection:
 * ¿Puede el usuario avanzar al siguiente nodo?
 */
export async function canAdvanceToNode(userId: string, nodeId: number) {
  const prerequisites = await getPrerequisitesForNode(nodeId);
  
  for (const prNodeId of prerequisites) {
    const mastery = await getUserMastery(userId, prNodeId);
    if (mastery < 0.7) { // Threshold de maestría
      return { canAdvance: false, missingPrerequisiteId: prNodeId };
    }
  }
  
  return { canAdvance: true };
}
