import { IndexedEntity } from "./core-utils";
import type { Session, ContextInteraction, User, Chat, ChatMessage } from "@shared/types";
import { MOCK_SESSIONS, MOCK_INTERACTIONS, MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class SessionEntity extends IndexedEntity<Session> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: Session = { 
    id: "", 
    title: "Untitled Workspace", 
    createdAt: 0, 
    lastAccessed: 0, 
    interactions: [] 
  };
  static seedData = MOCK_SESSIONS.map(s => ({
    ...s,
    interactions: MOCK_INTERACTIONS.filter(i => i.sessionId === s.id)
  }));
  async addInteraction(interaction: ContextInteraction): Promise<Session> {
    return this.mutate(s => ({
      ...s,
      lastAccessed: Date.now(),
      interactions: [...s.interactions, interaction]
    }));
  }
}
// Legacy demo entities for template compatibility
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}