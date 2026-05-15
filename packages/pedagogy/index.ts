import { SkillNode, NodeConnection } from '../ontology';
import { graphEngine } from '../graph-engine';

export interface LearningPath {
  userId: string;
  steps: number[]; // Array of node IDs
  targetNodeId: number;
}

export class PedagogyEngine {
  async designPath(userId: string, targetNodeId: number, nodes: SkillNode[], connections: NodeConnection[], completedIds: number[]): Promise<LearningPath> {
    const gaps = await graphEngine.findGaps(
      completedIds.map(id => ({ nodeId: id, level: 1.0 })),
      targetNodeId,
      connections
    );

    // Simplistic path: gaps first, then the target
    return {
      userId,
      targetNodeId,
      steps: [...gaps, targetNodeId]
    };
  }

  getDifficultyLabel(score: number): string {
    if (score < 4) return 'Beginner';
    if (score < 7) return 'Intermediate';
    return 'Advanced';
  }
}

export const pedagogyEngine = new PedagogyEngine();
