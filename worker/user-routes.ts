import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import { SessionEntity } from "./entities";
import type { ContextInteraction, IdeaBurst } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/sessions', async (c) => {
    await SessionEntity.ensureSeed(c.env);
    const { items } = await SessionEntity.list(c.env);
    return ok(c, items.sort((a, b) => b.lastAccessed - a.lastAccessed));
  });
  app.post('/api/sessions', async (c) => {
    const { title } = await c.req.json() as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const session = await SessionEntity.create(c.env, {
      id: crypto.randomUUID(),
      title: title.trim(),
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      interactions: [],
      checkpoints: [],
      agentMode: false
    });
    return ok(c, session);
  });
  app.get('/api/sessions/:sessionId', async (c) => {
    const entity = new SessionEntity(c.env, c.req.param('sessionId'));
    if (!(await entity.exists())) return notFound(c);
    return ok(c, await entity.getState());
  });
  app.delete('/api/sessions/:sessionId', async (c) => {
    return ok(c, { deleted: await SessionEntity.delete(c.env, c.req.param('sessionId')) });
  });
  app.post('/api/sessions/:sessionId/agent', async (c) => {
    const { active } = await c.req.json() as { active: boolean };
    const entity = new SessionEntity(c.env, c.req.param('sessionId'));
    if (!(await entity.exists())) return notFound(c);
    return ok(c, await entity.setAgentMode(active));
  });
  app.get('/api/synthesis/ideas', async (c) => {
    const categories: IdeaBurst['category'][] = ['Substitute', 'Combine', 'Adapt', 'Modify', 'Put to use', 'Eliminate', 'Reverse'];
    const ideas: IdeaBurst[] = Array.from({ length: 9 }).map((_, i) => ({
      id: `idea-${i}`,
      title: `LMP Strategy Concept ${i + 1}`,
      category: categories[i % categories.length],
      description: `Synthesized creative path based on current semantic density and temporal access patterns in this session context.`
    }));
    return ok(c, ideas);
  });
  app.post('/api/sessions/:sessionId/query', async (c) => {
    const sessionId = c.req.param('sessionId');
    const isAgent = c.req.query('mode') === 'agent';
    const { userQuery } = await c.req.json() as { userQuery?: string };
    if (!userQuery?.trim()) return bad(c, 'query required');
    const entity = new SessionEntity(c.env, sessionId);
    if (!(await entity.exists())) return notFound(c);
    const interaction: ContextInteraction = {
      id: crypto.randomUUID(),
      sessionId,
      userQuery: userQuery.trim(),
      aiResponse: isAgent 
        ? "AGENTIC SYNTHESIS COMPLETE: Weighted centroid vectors matched. Reasoning path established through semantic meta-layers."
        : "Standard retrieval successful. Persistence layer confirms high context fidelity.",
      retrievedContext: ['LMP Meta-Node 42a', 'Episodic Fragment 77b'],
      timestamp: Date.now()
    };
    const updated = await entity.addInteraction(interaction, isAgent);
    return ok(c, updated);
  });
}