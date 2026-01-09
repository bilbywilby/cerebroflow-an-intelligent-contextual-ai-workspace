import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { SessionEntity } from "./entities";
import type { ContextInteraction } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // LIST SESSIONS
  app.get('/api/sessions', async (c) => {
    await SessionEntity.ensureSeed(c.env);
    const { items } = await SessionEntity.list(c.env);
    // Sort by last accessed descending
    const sorted = [...items].sort((a, b) => b.lastAccessed - a.lastAccessed);
    return ok(c, sorted);
  });
  // CREATE SESSION
  app.post('/api/sessions', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const id = crypto.randomUUID();
    const now = Date.now();
    const session = await SessionEntity.create(c.env, {
      id,
      title: title.trim(),
      createdAt: now,
      lastAccessed: now,
      interactions: []
    });
    return ok(c, session);
  });
  // GET SESSION
  app.get('/api/sessions/:sessionId', async (c) => {
    const sessionId = c.req.param('sessionId');
    const entity = new SessionEntity(c.env, sessionId);
    if (!(await entity.exists())) return notFound(c, 'Session not found');
    const state = await entity.getState();
    return ok(c, state);
  });
  // DELETE SESSION
  app.delete('/api/sessions/:sessionId', async (c) => {
    const sessionId = c.req.param('sessionId');
    const deleted = await SessionEntity.delete(c.env, sessionId);
    return ok(c, { deleted });
  });
  // QUERY / ADD INTERACTION
  app.post('/api/sessions/:sessionId/query', async (c) => {
    const sessionId = c.req.param('sessionId');
    const { userQuery } = (await c.req.json()) as { userQuery?: string };
    if (!userQuery?.trim()) return bad(c, 'query required');
    const entity = new SessionEntity(c.env, sessionId);
    if (!(await entity.exists())) return notFound(c, 'Session not found');
    // Simulate AI synthesis & semantic retrieval logic
    const interaction: ContextInteraction = {
      id: crypto.randomUUID(),
      sessionId,
      userQuery: userQuery.trim(),
      aiResponse: `Processed through Layered Memory Protocol. Contextual retrieval suggests high relevance to your recent activity in workspace "${(await entity.getState()).title}".`,
      retrievedContext: [
        'Semantic hit: Previous session context confirmed.',
        'Episodic hit: User history pattern recognized.'
      ],
      timestamp: Date.now()
    };
    const updated = await entity.addInteraction(interaction);
    return ok(c, updated);
  });
}