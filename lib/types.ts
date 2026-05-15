
/**
 * Estructura de datos para un curso generado automáticamente.
 */
export type ExecutionState = 'NOT_STARTED' | 'GENERATED' | 'IN_PROGRESS' | 'BLOCKED' | 'MASTERED' | 'COMPLETED';

export interface Lesson {
  id: string;
  title: string;
  type: 'concept' | 'practice' | 'assessment';
  prerequisites: string[];
  content_spec: {
    explanation_required: boolean;
    example_required: boolean;
    exercise_required: boolean;
  };
  pedagogical_reasoning: string;
  state?: ExecutionState;
}

export interface Module {
  id: string;
  title: string;
  difficulty: number;
  lessons: Lesson[];
  state?: ExecutionState;
}

export interface Course {
  id: string;
  topic: string;
  title: string;
  description: string;
  difficulty_model: 'linear' | 'adaptive';
  estimated_duration: number;
  modules: Module[];
  assessment_strategy: {
    frequency: 'per_lesson' | 'per_module';
    type: 'quiz' | 'project' | 'mixed';
  };
  dependency_graph: Array<{
    from: string;
    to: string;
    type: 'requires';
  }>;
  metadata?: {
    generated_at: string;
    pipeline_version: string;
  };
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
