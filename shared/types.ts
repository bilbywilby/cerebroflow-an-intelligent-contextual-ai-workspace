export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  provenance?: ProvenanceNode[];
  synthesis?: IdeaBurst[];
}
export interface ProvenanceNode {
  layer: 'Sensory' | 'Episodic' | 'Semantic' | 'Procedural' | 'Meta';
  nodeId: string;
  similarity: number;
  age: string;
}
export interface IdeaBurst {
  id: string;
  title: string;
  category: 'Substitute' | 'Combine' | 'Adapt' | 'Modify' | 'Put to use' | 'Eliminate' | 'Reverse';
  description: string;
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
  agentic?: boolean;
  metadata?: {
    relevance: number; 
    decayRate: number;
    complexity: number;
    sensoryLoad: number;
    provenance?: ProvenanceNode[];
  };
}
export interface Session {
  id: string;
  title: string;
  createdAt: number;
  lastAccessed: number;
  interactions: ContextInteraction[];
  checkpoints: Checkpoint[];
  agentMode?: boolean;
}
export interface User { id: string; name: string; }
export interface Chat { id: string; title: string; }
export interface ChatMessage { id: string; chatId: string; userId: string; text: string; ts: number; }