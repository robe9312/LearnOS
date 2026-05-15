
/**
 * Estructura de datos para un curso generado automáticamente.
 */
export interface Course {
  id: string;
  topic: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  curriculum: Module[];
  knowledgeGraph: {
    nodes: Array<{ id: string; label: string; type: string }>;
    edges: Array<{ from: string; to: string; label: string }>;
  };
  metadata?: {
    generated_at: string;
    pipeline_version: string;
  };
}

export type ExecutionState = 'NOT_STARTED' | 'GENERATED' | 'IN_PROGRESS' | 'BLOCKED' | 'MASTERED' | 'COMPLETED';

export interface Module {
  id: string;
  title: string;
  description: string;
  objective: string;
  lessons: Lesson[];
  state?: ExecutionState;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'concept' | 'application' | 'synthesis';
  content_preview: string;
  pedagogical_reasoning?: string; // "Why this lesson exists"
  state?: ExecutionState;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  courseId: string;
  currentModuleId: string;
  currentLessonId: string;
  masteryScore: number;
  velocity: number; // lessons per hour
  completedLessons: string[];
  gapAreas: string[]; // Topics detected as weak
  lastActivity: string;
}
