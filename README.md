# Cerebroflow AI - Cloudflare Workers Chat Demo

[cloudflarebutton]

A production-ready full-stack chat application built with Cloudflare Workers, Durable Objects, and React. Demonstrates multi-tenant entity management using a single Global Durable Object for efficient storage, indexing, and listing. Features a modern React frontend with shadcn/ui, Tanstack Query for data fetching, and Tailwind CSS for styling.

## Key Features

- **Durable Objects for Entities**: One DO instance per user/chat, backed by a shared GlobalDurableObject for KV-like storage with versioning and CAS.
- **Indexed Listing**: Efficient pagination with prefix indexes for users and chats.
- **Real-time Chat**: Chat boards store messages directly, with create/send/list APIs.
- **Modern React UI**: Responsive design with sidebar layout, theme toggle, error boundaries, and toast notifications.
- **Type-Safe APIs**: Shared types between frontend and worker, Hono routing, Zod validation-ready.
- **Production Optimizations**: Hot module replacement, TypeScript, Tailwind JIT, Vite bundling.
- **Seed Data**: Mock users/chats/messages auto-populate on first run.
- **Client Error Reporting**: Automatic error logging to worker.

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, TypeScript, Tanstack Query
- **UI**: shadcn/ui (Radix UI primitives), Tailwind CSS, Lucide icons
- **State/Data**: Zustand, Immer, React Hook Form, Zod
- **Utils**: clsx, tailwind-merge, date-fns, uuid
- **Package Manager**: Bun
- **Deployment**: Wrangler

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed (`bun install -g wrangler`)
- Cloudflare account with Workers enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd cerebroflow-ai-55yreanwpskvkfribvcpn
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

4. Login to Cloudflare:
   ```bash
   wrangler login
   ```

## Development

### Run Locally

Start the development server:
```bash
bun run dev
```

- Frontend: http://localhost:3000 (Vite HMR)
- Backend APIs: http://localhost:3000/api/* (proxied via Worker)

### Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server (frontend + worker proxy) |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run preview` | Preview production build |
| `bun run deploy` | Build + deploy to Cloudflare |

### Project Structure

```
├── shared/          # Shared types & mock data
├── src/             # React frontend (pages, components, hooks, lib)
├── worker/          # Cloudflare Worker (routes, entities, utils)
├── prompts/         # AI interaction guides (optional)
└── ...              # Configs (Vite, Tailwind, Wrangler, tsconfig)
```

**Customize Easily**:
- Add routes: `worker/user-routes.ts`
- Add entities: `worker/entities.ts` (extends IndexedEntity)
- Update UI: `src/pages/HomePage.tsx` (or add Router routes)
- Shared types: `shared/types.ts`

## Usage Examples

### API Endpoints

All APIs return `{ success: boolean, data?: T, error?: string }`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users?cursor=&limit=` | List users (paginated) |
| POST | `/api/users` | Create user `{ name: string }` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Delete many `{ ids: string[] }` |
| GET | `/api/chats?cursor=&limit=` | List chats |
| POST | `/api/chats` | Create chat `{ title: string }` |
| GET | `/api/chats/:chatId/messages` | List messages |
| POST | `/api/chats/:chatId/messages` | Send message `{ userId: string, text: string }` |

### Frontend Data Fetching

Uses `api-client.ts` wrapper with Tanstack Query:

```tsx
import { api } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

const users = useQuery({
  queryKey: ['users'],
  queryFn: () => api<User[]>('/api/users'),
});
```

## Deployment

Deploy to Cloudflare Workers in one command:

```bash
bun run deploy
```

Or manually:

1. Build assets: `bun run build`
2. Deploy: `wrangler deploy`

[cloudflarebutton]

**Custom Domain**: Edit `wrangler.jsonc` and run `wrangler deploy --env production`.

**Observability**: Enabled by default (logs, metrics). View in Cloudflare dashboard.

## Extending the App

### Add New Entity

1. Define in `shared/types.ts`: `interface NewEntity { id: string; ... }`
2. Create class in `worker/entities.ts`:
   ```ts
   export class NewEntityClass extends IndexedEntity<NewEntity> {
     static readonly entityName = "newentity";
     static readonly indexName = "newentities";
     static readonly initialState = { id: "", ... };
   }
   ```
3. Add routes in `worker/user-routes.ts` using `ok`, `bad`, etc.

### UI Customization

- **Pages**: Edit `src/pages/` or add Router routes in `main.tsx`
- **Components**: Use shadcn/ui in `src/components/ui/`
- **Layout**: Toggle `AppLayout` for sidebar
- **Theme**: Dark/light with `useTheme()`

## Troubleshooting

- **Types out of sync**: Run `bun run cf-typegen`
- **Deploy fails**: Check `wrangler tail` for logs
- **CORS issues**: Pre-configured for `/api/*`
- **Lint errors**: `bun run lint`
- **Worker routes fail**: Check `worker/user-routes.ts` syntax (auto-reloads in dev)

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with ❤️ for Cloudflare Workers. Questions? Open an issue!