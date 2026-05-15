export interface SkillNode {
  id: number;
  slug: string;
  title: string;
  description?: string;
  difficultyScore: number;
}

export type ConnectionType = 'prerequisite' | 'recommends' | 'alternative';

export interface NodeConnection {
  sourceNodeId: number;
  targetNodeId: number;
  type: ConnectionType;
}

export interface MasteryState {
  conceptualUnderstanding: number; // 0.0 - 1.0 (Understanding of 'why')
  proceduralFluency: number;       // 0.0 - 1.0 (Ability to 'do')
  transferAbility: number;        // 0.0 - 1.0 (Application in new contexts)
  retention: number;               // 0.0 - 1.0 (Persistence over time)
  confidence: number;              // 0.0 - 1.0 (Self-reported or inferred certainty)
  stability: number;               // 0.0 - 1.0 (Resistance to decay)
}

export interface MasteryRecord {
  userId: string;
  nodeId: string;
  state: MasteryState;
  lastUpdated: string;
  lastAssessment: string;
  version: number;
}

export interface CognitiveSignal {
  userId: string;
  nodeId: string;
  type: 'CORRECT_ANSWER' | 'WRONG_ANSWER' | 'REFLECTION' | 'HINT_USED' | 'TIME_SPENT';
  value: number;
  timestamp: string;
}

export interface AssessmentResult {
  userId: string;
  nodeId: number;
  score: number;
  timestamp: Date;
}

export type NarrativeArc = 'exposition' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';

export interface NarrativeUnit {
  id: string;
  title: string;
  hook: string;
  content: string;
  challenges: string[];
  arc: NarrativeArc;
  associatedNodeIds: string[];
}

export interface LearningArc {
  id: string;
  userId: string;
  targetNodeId: string;
  currentArc: NarrativeArc;
  progress: number; // 0 to 1
  history: string[]; // IDs of NarrativeUnits
}
