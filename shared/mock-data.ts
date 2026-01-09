import type { Session, ContextInteraction, User, Chat, ChatMessage } from './types';
export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Research: Neural Architectures',
    createdAt: Date.now() - 86400000 * 2,
    lastAccessed: Date.now() - 3600000,
  },
  {
    id: 's2',
    title: 'Marketing Strategy 2024',
    createdAt: Date.now() - 86400000 * 10,
    lastAccessed: Date.now() - 86400000,
  },
  {
    id: 's3',
    title: 'Quantum Computing Fundamentals',
    createdAt: Date.now() - 3600000,
    lastAccessed: Date.now() - 600000,
  },
];
export const MOCK_INTERACTIONS: ContextInteraction[] = [
  {
    id: 'i1',
    sessionId: 's1',
    userQuery: 'What are the main layers of the memory protocol?',
    aiResponse: 'The Layered Memory Protocol (LMP) consists of five primary layers: Sensory Buffer (immediate), Episodic Layer (events), Semantic Layer (meanings), Procedural Layer (methods), and the Meta-Cognitive Layer (pruning/decay). Each layer serves a specific temporal and semantic resolution.',
    retrievedContext: ['Sensory Buffer docs', 'LMP Overview'],
    timestamp: Date.now() - 5000000,
  },
  {
    id: 'i2',
    sessionId: 's1',
    userQuery: 'Explain the pruning mechanism.',
    aiResponse: 'Pruning in LMP utilizes a temporal decay function coupled with a semantic relevance score. Information that hasn\'t been accessed within a specific window and has low similarity to recent queries is moved to "cold storage" or compressed to save token context.',
    retrievedContext: ['Pruning Logic v2', 'Semantic Decay Factors'],
    timestamp: Date.now() - 2500000,
  },
];
// Original demo mocks
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];