import { IndexedEntity } from "./core-utils";
import type { Session, ContextInteraction, Checkpoint, ProvenanceNode, User, Chat, ChatMessage } from "@shared/types";
import { MOCK_SESSIONS, MOCK_INTERACTIONS, MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
import { LMP_CONFIG } from "@shared/lmp-config";
export class SessionEntity extends IndexedEntity<Session> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: Session = {
    id: "",
    title: "Untitled Workspace",
    createdAt: 0,
    lastAccessed: 0,
    interactions: [],
    checkpoints: [],
    agentMode: false
  };
  static seedData = MOCK_SESSIONS.map(s => ({
    ...s,
    agentMode: false,
    interactions: MOCK_INTERACTIONS.filter(i => i.sessionId === s.id).map(i => ({
      ...i,
      metadata: {
        relevance: Math.floor(Math.random() * 40) + 60,
        decayRate: Math.floor(Math.random() * 30),
        complexity: Math.floor(Math.random() * 50) + 20,
        sensoryLoad: Math.floor(Math.random() * 50) + 10,
        provenance: this.generateMockProvenance()
      }
    })),
    checkpoints: []
  }));
  private static generateMockProvenance(): ProvenanceNode[] {
    const layers: ProvenanceNode['layer'][] = ['Sensory', 'Episodic', 'Semantic', 'Procedural', 'Meta'];
    return Array.from({ length: 3 }).map(() => ({
      layer: layers[Math.floor(Math.random() * layers.length)],
      nodeId: Math.random().toString(16).slice(2, 6),
      similarity: Number((0.7 + Math.random() * 0.25).toFixed(2)),
      age: `${Math.floor(Math.random() * 24)}h`
    }));
  }
  async setAgentMode(active: boolean): Promise<Session> {
    return this.mutate(s => ({ ...s, agentMode: active }));
  }
  async addInteraction(interaction: ContextInteraction, isAgent: boolean = false): Promise<Session> {
    const provenance = SessionEntity.generateMockProvenance();
    const prefix = isAgent ? `[AGENT REASONING: ${LMP_CONFIG.AGENT_INITIAL_PROMPT}] ` : "";
    const metaInteraction: ContextInteraction = {
      ...interaction,
      agentic: isAgent,
      aiResponse: prefix + interaction.aiResponse,
      metadata: {
        relevance: isAgent ? 95 : Math.floor(Math.random() * 40) + 60,
        decayRate: LMP_CONFIG.DECAY_RATE * 100,
        complexity: isAgent ? 85 : Math.floor(Math.random() * 70) + 10,
        sensoryLoad: Math.floor(Math.random() * 40) + 20,
        provenance
      }
    };
    return this.mutate(s => ({
      ...s,
      lastAccessed: Date.now(),
      interactions: [...s.interactions, metaInteraction]
    }));
  }
  async addCheckpoint(title: string, interactionId: string): Promise<Checkpoint> {
    const checkpoint: Checkpoint = {
      id: crypto.randomUUID(),
      title,
      interactionId,
      timestamp: Date.now()
    };
    await this.mutate(s => ({
      ...s,
      checkpoints: [...(s.checkpoints || []), checkpoint]
    }));
    return checkpoint;
  }
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class ChatBoardEntity extends IndexedEntity<Chat & { messages: ChatMessage[] }> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState = { id: "", title: "", messages: [] };
  static seedData = MOCK_CHATS.map(c => ({ ...c, messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id) }));
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}