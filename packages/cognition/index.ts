import { eventBus, EventPriority } from '../events';
import { graphEngine } from '../graph-engine';
import { aiProvider } from '../ai-provider';
import { MasteryRecord, NodeConnection } from '../ontology';

export class CognitionRuntime {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    // Escuchar cuando se completa un Quiz
    eventBus.on('QUIZ_COMPLETED', async (event) => {
      console.log(`[Cognition] Reaccionando a Quiz completado por ${event.payload.userId}`);
      
      // Lógica reactiva: Si el score es > 0.8, buscar siguientes pasos
      if (event.payload.score > 0.8) {
        await eventBus.emit({
          type: 'AGENT_ACTION_REQUESTED',
          payload: {
            userId: event.payload.userId,
            agentId: 'tutor-prime',
            action: 'CONGRATULATE_AND_PROPOSE_NEXT',
            context: { nodeId: event.payload.nodeId }
          },
          meta: eventBus.createMeta(EventPriority.MEDIUM)
        });
      }
    });

    // Escuchar actualizaciones de maestría para recalcular el path si es necesario
    eventBus.on('MASTERY_UPDATED', async (event) => {
      if (event.payload.level < 0.3) {
        await eventBus.emit({
          type: 'KNOWLEDGE_GAP_DETECTED',
          payload: { 
            userId: event.payload.userId, 
            nodeId: event.payload.nodeId,
            missingPrerequisites: ['Fundamental concepts reinforcement needed'] 
          },
          meta: eventBus.createMeta(EventPriority.HIGH)
        });
      }
    });
  }

  async processAssessment(userId: string, nodeId: string, score: number) {
    await eventBus.emit({
      type: 'QUIZ_COMPLETED',
      payload: { userId, nodeId, score, attemptId: Date.now().toString() },
      meta: eventBus.createMeta(EventPriority.HIGH)
    });
  }

  async checkNextStep(userId: string, targetNodeId: number, currentMastery: MasteryRecord[], connections: NodeConnection[]) {
    const gaps = await graphEngine.findGaps(
      currentMastery.map(m => ({ nodeId: m.nodeId, level: m.masteryLevel })),
      targetNodeId,
      connections
    );

    if (gaps.length > 0) {
      await eventBus.emit({
        type: 'KNOWLEDGE_GAP_DETECTED',
        payload: { 
          userId, 
          nodeId: targetNodeId.toString(), 
          missingPrerequisites: gaps.map(g => g.toString()) 
        },
        meta: eventBus.createMeta(EventPriority.HIGH)
      });
      return { status: 'blocked', gaps };
    }

    return { status: 'ready' };
  }

  async explainConcept(conceptTitle: string) {
    return aiProvider.chat(`Explica el concepto de "${conceptTitle}" de forma concisa y pedagógica.`);
  }
}

export const cognitionRuntime = new CognitionRuntime();
