import { aiProvider } from '../ai-provider';
import { eventBus, EventPriority } from '../events';
import { SkillNode, MasteryRecord, NarrativeUnit, LearningArc, NarrativeArc } from '../ontology';

export class NarrativeRuntime {
  private arcs: NarrativeArc[] = ['exposition', 'rising_action', 'climax', 'falling_action', 'resolution'];

  async startNewArc(userId: string, targetNode: SkillNode): Promise<LearningArc> {
    const arc: LearningArc = {
      id: Math.random().toString(36).substring(7),
      userId,
      targetNodeId: targetNode.id.toString(),
      currentArc: 'exposition',
      progress: 0,
      history: []
    };

    await eventBus.emit({
      type: 'PATH_RECALCULATED',
      payload: { userId, reason: `Starting narrative arc for ${targetNode.title}` },
      meta: eventBus.createMeta(EventPriority.MEDIUM)
    });

    return arc;
  }

  async generateNarrativeUnit(arc: LearningArc, node: SkillNode, mastery: MasteryRecord): Promise<NarrativeUnit> {
    const prompt = `
      Genera una UNIDAD NARRATIVA de aprendizaje (NarrativeUnit).
      - Tema: ${node.title} (${node.description})
      - Fase del Arco: ${arc.currentArc}
      - Nivel de usuario: ${mastery.state.proceduralFluency.toFixed(2)}
      
      La narrativa debe ser inmersiva: el usuario es un "Arquitecto de Realidad" en LearnOS.
      Formato JSON: { "id": "uuid", "title": "...", "hook": "...", "content": "...", "challenges": ["...", "..."], "arc": "${arc.currentArc}", "associatedNodeIds": ["${node.id}"] }
    `;

    const response = await aiProvider.chat(prompt, { temperature: 0.8 });
    try {
      return JSON.parse(response);
    } catch {
      return {
        id: 'fallback-unit',
        title: `Exploración de ${node.title}`,
        hook: 'Te encuentras ante un nuevo nodo de conocimiento.',
        content: response,
        challenges: ['Demuestra tu comprensión'],
        arc: arc.currentArc,
        associatedNodeIds: [node.id.toString()]
      };
    }
  }

  advanceArc(current: LearningArc): LearningArc {
    const currentIndex = this.arcs.indexOf(current.currentArc);
    const nextIndex = Math.min(this.arcs.length - 1, currentIndex + 1);
    
    return {
      ...current,
      currentArc: this.arcs[nextIndex],
      progress: (nextIndex + 1) / this.arcs.length
    };
  }
}

export const narrativeRuntime = new NarrativeRuntime();
