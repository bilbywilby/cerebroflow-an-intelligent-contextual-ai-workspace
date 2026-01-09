export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Session {
  id: string;
  title: string;
  createdAt: number;
  lastAccessed: number;
}
export interface ContextInteraction {
  id: string;
  sessionId: string;
  userQuery: string;
  aiResponse: string;
  retrievedContext: string[];
  timestamp: number;
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