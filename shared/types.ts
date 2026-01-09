export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Checkpoint {
  id: string;
  title: string;
  interactionId: string;
  timestamp: number;
}
export interface ContextInteraction {
  id: string;
  sessionId: string;
  userQuery: string;
  aiResponse: string;
  retrievedContext: string[];
  timestamp: number;
  metadata?: {
    relevance: number; // 0-100
    decayRate: number; // 0-100
    complexity: number; // 0-100
    sensoryLoad: number; // 0-100
  };
}
export interface Session {
  id: string;
  title: string;
  createdAt: number;
  lastAccessed: number;
  interactions: ContextInteraction[];
  checkpoints: Checkpoint[];
}
// Keep original demo types for compatibility
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}