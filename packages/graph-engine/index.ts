import { SkillNode, NodeConnection } from '../ontology';

export class GraphEngine {
  async getPrerequisites(nodeId: number, connections: NodeConnection[]): Promise<number[]> {
    return connections
      .filter(c => c.targetNodeId === nodeId && c.type === 'prerequisite')
      .map(c => c.sourceNodeId);
  }

  async findGaps(masteryList: { nodeId: number; level: number }[], targetNodeId: number, connections: NodeConnection[]): Promise<number[]> {
    const prerequisites = await this.getPrerequisites(targetNodeId, connections);
    const gaps: number[] = [];

    for (const preId of prerequisites) {
      const mastery = masteryList.find(m => m.nodeId === preId);
      if (!mastery || mastery.level < 0.7) {
        gaps.push(preId);
      }
    }

    return gaps;
  }

  async getRecommendedNextNodes(completedNodeIds: number[], nodes: SkillNode[], connections: NodeConnection[]): Promise<number[]> {
    // Basic recommendation logic: nodes where all prerequisites are met but not completed
    const recommendations: number[] = [];
    
    for (const node of nodes) {
      if (completedNodeIds.includes(node.id)) continue;
      
      const prerequisites = await this.getPrerequisites(node.id, connections);
      const metAll = prerequisites.every(id => completedNodeIds.includes(id));
      
      if (metAll) {
        recommendations.push(node.id);
      }
    }
    
    return recommendations;
  }
}

export const graphEngine = new GraphEngine();
