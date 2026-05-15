
import { Course, UserProgress, ExecutionState } from './types';

export class LearningExecutionEngine {
  private static STORAGE_KEY_PREFIX = 'learnos_progress_';

  static getProgress(courseId: string): UserProgress | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.STORAGE_KEY_PREFIX + courseId);
    return saved ? JSON.parse(saved) : null;
  }

  static saveProgress(progress: UserProgress) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY_PREFIX + progress.courseId, JSON.stringify(progress));
  }

  static initializeProgress(course: Course): UserProgress {
    const progress: UserProgress = {
      courseId: course.id,
      currentModuleId: course.modules[0]?.id || '',
      currentLessonId: course.modules[0]?.lessons[0]?.id || '',
      masteryScore: 0,
      velocity: 0,
      completedLessons: [],
      gapAreas: [],
      lastActivity: new Date().toISOString(),
    };
    this.saveProgress(progress);
    return progress;
  }

  static completeLesson(courseId: string, lessonId: string, masteryGain: number) {
    const progress = this.getProgress(courseId);
    if (!progress) return;

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.masteryScore = Math.min(100, progress.masteryScore + masteryGain);
      
      // Calculate velocity (very simple: lessons per activity)
      progress.velocity = progress.completedLessons.length / 1; // Needs more complex time tracking for real velocity
      
      progress.lastActivity = new Date().toISOString();
      this.saveProgress(progress);
    }
  }

  static recordGap(courseId: string, topic: string) {
    const progress = this.getProgress(courseId);
    if (!progress) return;

    if (!progress.gapAreas.includes(topic)) {
      progress.gapAreas.push(topic);
      this.saveProgress(progress);
    }
  }

  static getExecutionState(course: Course): ExecutionState {
    const progress = this.getProgress(course.id);
    if (!progress) return 'NOT_STARTED';
    
    if (progress.completedLessons.length === 0) return 'GENERATED';
    
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (progress.completedLessons.length === totalLessons) return 'COMPLETED';
    
    if (progress.gapAreas.length > 2) return 'BLOCKED';
    
    if (progress.masteryScore > 80) return 'MASTERED';
    
    return 'IN_PROGRESS';
  }
}
