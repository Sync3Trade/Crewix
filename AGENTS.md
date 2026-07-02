<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- **Product:** `crewix` — a single Next.js 16 (App Router) + React 19 + Tailwind v4 marketing landing page. There is no backend, database, API routes, or env vars (V1 scope is the landing page only).
- **Package manager:** npm (only `package-lock.json` present). The update script runs `npm install`.
- **Run/build/lint/test:** use the scripts in `package.json` (`npm run dev` on port 3000, `npm run build`, `npm run lint`). There is no test script or test framework in this repo.
- **Dev server:** `npm run dev` uses Turbopack and serves http://localhost:3000. Start it as a long-running process (e.g. in a background terminal), not inline.
