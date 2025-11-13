# Frontend – Agentic RAG Book Generator UI

## Tech Stack

- Vite + React 18
- TypeScript (strict mode)
- Tailwind-friendly component system (Shadcn-inspired)

## Environment Variables

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_BACKEND_URL` | Fully-qualified base URL for the FastAPI backend | `https://your-backend.onrender.com` |

Create a `.env.local` when developing locally:

```
VITE_BACKEND_URL=http://localhost:8000
```

## Scripts

```bash
npm run dev       # Start Vite dev server on http://localhost:3000
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview the production build locally
```

## Deployment (Vercel)

1. Push `frontend/` to its own Git repository.
2. In Vercel, create a new project, import the repo, and use the following defaults:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add an environment variable in Vercel (`VITE_BACKEND_URL`) that points to the Render backend URL.
4. Trigger a deployment. Hot reload and health dashboards rely on the backend endpoints now being live.

