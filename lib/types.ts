
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
}

export interface Module {
  id: string;
  title: string;
  description: string;
  objective: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'concept' | 'application' | 'synthesis';
  content_preview: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
