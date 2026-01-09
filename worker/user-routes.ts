import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { MOCK_SESSIONS, MOCK_INTERACTIONS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // SESSIONS
  app.get('/api/sessions', async (c) => {
    return ok(c, MOCK_SESSIONS);
  });
  app.post('/api/sessions', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const newSession = {
      id: crypto.randomUUID(),
      title: title.trim(),
      createdAt: Date.now(),
      lastAccessed: Date.now()
    };
    return ok(c, newSession);
  });
  // QUERY
  app.post('/api/sessions/:sessionId/query', async (c) => {
    const sessionId = c.req.param('sessionId');
    const { userQuery } = (await c.req.json()) as { userQuery?: string };
    if (!userQuery?.trim()) return bad(c, 'query required');
    // Simulate AI response for testing
    const interaction = {
      id: crypto.randomUUID(),
      sessionId,
      userQuery,
      aiResponse: `This is a mock response from the CerebroFlow LMP for session ${sessionId}. Semantic retrieval found 3 relevant matches.`,
      retrievedContext: ['Mock context snippet 1', 'Mock context snippet 2'],
      timestamp: Date.now()
    };
    return ok(c, interaction);
  });
  // LEGACY COMPATIBILITY
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CerebroFlow Backend v1' }}));
}