export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export type EventMetadata = {
  timestamp: string;
  version: string;
  priority: EventPriority;
  traceId: string;
};

export type AppEvent = 
  | { type: 'QUIZ_COMPLETED'; payload: { userId: string; nodeId: string; score: number; attemptId: string }; meta: EventMetadata }
  | { type: 'MASTERY_UPDATED'; payload: { userId: string; nodeId: string; level: number; delta: number }; meta: EventMetadata }
  | { type: 'KNOWLEDGE_GAP_DETECTED'; payload: { userId: string; nodeId: string; missingPrerequisites: string[] }; meta: EventMetadata }
  | { type: 'NODE_GENERATED'; payload: { nodeId: string; creatorId: string; type: string }; meta: EventMetadata }
  | { type: 'PATH_RECALCULATED'; payload: { userId: string; reason: string }; meta: EventMetadata }
  | { type: 'RETENTION_DECAY_DETECTED'; payload: { userId: string; nodeId: string; estimatedMastery: number }; meta: EventMetadata }
  | { type: 'AGENT_ACTION_REQUESTED'; payload: { userId: string; agentId: string; action: string; context: any }; meta: EventMetadata };

type Handler<T extends AppEvent> = (event: T) => void | Promise<void>;

class EventBus {
  private handlers = new Map<AppEvent['type'], Handler<any>[]>();
  private eventLog: AppEvent[] = []; // Replay capability base

  on<T extends AppEvent>(type: T['type'], handler: Handler<T>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  async emit<T extends AppEvent>(event: T) {
    this.eventLog.push(event);
    console.log(`[EventBus] ${event.meta.priority.toUpperCase()}: ${event.type}`, event.payload);
    
    const handlers = this.handlers.get(event.type) || [];
    // Ejecución asíncrona para no bloquear el hilo principal del runtime
    handlers.forEach(h => {
      h(event).catch(err => console.error(`[EventBus Error] in handler for ${event.type}:`, err));
    });
  }

  createMeta(priority: EventPriority = EventPriority.MEDIUM): EventMetadata {
    return {
      timestamp: new Date().toISOString(),
      version: '1.0',
      priority,
      traceId: Math.random().toString(36).substring(7)
    };
  }

  getHistory() {
    return [...this.eventLog];
  }
}

export const eventBus = new EventBus();
