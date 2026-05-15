import { aiProvider } from '../ai-provider';
import { cognitionRuntime } from '../cognition';
import { memoryStore } from '../memory';
import { graphEngine } from '../graph-engine';
import { SkillNode, MasteryRecord, NodeConnection } from '../ontology';

export interface CognitiveState {
  activeNodeId: string;
  intent: 'explaining' | 'testing' | 'reflecting' | 'revising';
  mastery: number;
  history: string[];
  signals: Record<string, any>;
}

export interface TutorResponse {
  content: string;
  suggestedAction: string;
  metadata: {
    socraticDepth: number;
    misconceptionDetected: boolean;
    narrativeArc: string;
  };
}

export class TutorAgent {
  async assembleContext(userId: string, nodeId: string, nodes: SkillNode[], connections: NodeConnection[], mastery: MasteryRecord[]) {
    const node = nodes.find(n => n.id.toString() === nodeId);
    const recentMemory = await memoryStore.recallContext(userId, node?.title || '');
    const prerequisites = await graphEngine.getPrerequisites(parseInt(nodeId), connections);
    
    return {
      node,
      recentMemory,
      prerequisites: prerequisites.map(id => nodes.find(n => n.id === id)),
      userMastery: mastery.find(m => m.nodeId.toString() === nodeId)?.masteryLevel || 0
    };
  }

  async interact(userId: string, state: CognitiveState, nodes: SkillNode[], connections: NodeConnection[], mastery: MasteryRecord[]): Promise<TutorResponse> {
    const context = await this.assembleContext(userId, state.activeNodeId, nodes, connections, mastery);
    
    const prompt = `
      CONTEXTO COGNITIVO:
      - Nodo Activo: ${context.node?.title} (${context.node?.description})
      - Maestría Usuario: ${context.userMastery.toFixed(2)}
      - Intento Actual: ${state.intent}
      - Memoria Reciente: ${context.recentMemory}
      - Prerrequisitos: ${context.prerequisites.map(p => p?.title).join(', ')}

      INSTRUCCIONES:
      1. Usa un enfoque SOCRÁTICO si la maestría es baja (>0.3).
      2. Si detectas confusión, aclara el modelo mental básico.
      3. Mantén la NARRATIVA: El usuario es un explorador en LearnOS.
      4. Si el intento es 'explaining', genera una explicación adaptativa.
      5. Si es 'reflecting', pide una analogía.

      Responde en formato JSON: { "content": "...", "suggestedAction": "...", "metadata": { ... } }
    `;

    const response = await aiProvider.chat(prompt, { temperature: 0.7 });
    
    try {
      return JSON.parse(response);
    } catch {
      return {
        content: response,
        suggestedAction: 'CONTINUE',
        metadata: { socraticDepth: 1, misconceptionDetected: false, narrativeArc: 'steady' }
      };
    }
  }

  async detectMisconceptions(userId: string, responseText: string): Promise<boolean> {
    const prompt = `Analiza la siguiente respuesta del estudiante y detecta si hay errores de concepto fundamentales: "${responseText}". Responde solo TRUE o FALSE.`;
    const result = await aiProvider.chat(prompt, { temperature: 0 });
    return result.toLowerCase().includes('true');
  }
}

export const tutorAgent = new TutorAgent();
