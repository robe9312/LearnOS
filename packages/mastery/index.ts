import { MasteryState, MasteryRecord, CognitiveSignal } from '../ontology';
import { eventBus, EventPriority } from '../events';

export class MasteryEngine {
  private DECAY_CONSTANT = 0.05; // Base decay rate

  calculateDecay(stability: number, daysSinceLastActivity: number): number {
    // Basic Ebbinghaus-inspired decay: R = e^(-t/S)
    return Math.exp(-daysSinceLastActivity / (stability * 10 + 1));
  }

  updateState(current: MasteryState, signal: CognitiveSignal): MasteryState {
    const newState = { ...current };

    switch (signal.type) {
      case 'CORRECT_ANSWER':
        newState.proceduralFluency = Math.min(1, newState.proceduralFluency + 0.1);
        newState.confidence = Math.min(1, newState.confidence + 0.05);
        newState.stability = Math.min(1, newState.stability + 0.02);
        break;
      case 'WRONG_ANSWER':
        newState.confidence = Math.max(0, newState.confidence - 0.1);
        newState.stability = Math.max(0, newState.stability - 0.05);
        break;
      case 'REFLECTION':
        newState.conceptualUnderstanding = Math.min(1, newState.conceptualUnderstanding + 0.15);
        break;
      case 'TIME_SPENT':
        // Complex inference: too much time might mean high cognitive load and lower fluency
        if (signal.value > 120) { // seconds
            newState.proceduralFluency = Math.max(0, newState.proceduralFluency - 0.02);
        }
        break;
    }

    return newState;
  }

  async processSignal(signal: CognitiveSignal, currentRecord: MasteryRecord) {
    const updatedState = this.updateState(currentRecord.state, signal);
    
    // Aggregated Mastery Score (weighted average)
    const aggregateMastery = (
        updatedState.conceptualUnderstanding * 0.4 +
        updatedState.proceduralFluency * 0.3 +
        updatedState.transferAbility * 0.2 +
        updatedState.retention * 0.1
    );

    const delta = aggregateMastery - (
        currentRecord.state.conceptualUnderstanding * 0.4 +
        currentRecord.state.proceduralFluency * 0.3 +
        currentRecord.state.transferAbility * 0.2 + 
        currentRecord.state.retention * 0.1
    );

    await eventBus.emit({
      type: 'MASTERY_UPDATED',
      payload: {
        userId: signal.userId,
        nodeId: signal.nodeId,
        level: aggregateMastery,
        delta: delta
      },
      meta: eventBus.createMeta(EventPriority.MEDIUM)
    });

    return { ...currentRecord, state: updatedState, lastUpdated: new Date().toISOString() };
  }
}

export const masteryEngine = new MasteryEngine();
