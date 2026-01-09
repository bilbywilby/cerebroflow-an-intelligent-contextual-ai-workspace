import { ApiResponse } from "@shared/types";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { 
    headers: { 'Content-Type': 'application/json' }, 
    ...init 
  });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success || json.data === undefined) throw new Error(json.error || 'Request failed');
  return json.data;
}
// Session-specific client helpers
export const sessionApi = {
  list: () => api<any[]>('/api/sessions'),
  create: (title: string) => api<any>('/api/sessions', { 
    method: 'POST', 
    body: JSON.stringify({ title }) 
  }),
  query: (sessionId: string, userQuery: string) => api<any>(`/api/sessions/${sessionId}/query`, {
    method: 'POST',
    body: JSON.stringify({ userQuery })
  })
};