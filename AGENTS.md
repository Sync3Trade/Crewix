<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- **Product:** `vertexwork` — Next.js 16 (App Router) + React 19 + Tailwind v4 SaaS app with landing page, auth, onboarding, dashboard, and Stripe billing.
- **Package manager:** npm. The update script runs `npm install`.
- **Database:** PostgreSQL via Docker (`docker compose up -d`) and Prisma (`npm run db:push`). Requires `.env` from `.env.example` with `DATABASE_URL` and `AUTH_SECRET`.
- **Run/build/lint/test:** use the scripts in `package.json` (`npm run dev` on port 3000, `npm run build`, `npm run lint`). There is no test script or test framework in this repo.
- **Dev server:** `npm run dev` uses Turbopack and serves http://localhost:3000. Start it as a long-running process (e.g. in a background terminal), not inline.
- **Email/Stripe:** optional in dev — emails log to console without `RESEND_API_KEY`; billing works with seeded data without Stripe keys.
