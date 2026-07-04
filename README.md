# VertexWork

AI workforce platform that helps businesses automate calls, lead qualification, appointment booking, and customer communication.

## Tech Stack

- **Next.js** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling with dark/light mode
- **PostgreSQL** — Primary database via Prisma ORM
- **NextAuth.js** — Authentication with credentials
- **Framer Motion** — Animations and transitions
- **Stripe** — Subscription billing
- **Recharts** — Dashboard analytics charts

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

Copy `.env.example` to `.env` and update values as needed:

```bash
cp .env.example .env
```

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Set up the database

```bash
npm run db:push
```

For production (Vercel), the build runs `prisma migrate deploy` automatically. Ensure `DATABASE_URL` is set in your Vercel project environment variables before deploying.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication Flow

1. **Sign up** at `/signup` — creates account and sends verification email
2. **Verify email** — click link in email (or check console in dev mode)
3. **Sign in** at `/login`
4. **Onboarding** at `/onboarding` — 5-step setup wizard
5. **Dashboard** at `/dashboard` — business overview, calls, appointments, AI employees, analytics, revenue, and billing

## Dashboard Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview with key metrics |
| `/dashboard/calls` | Call history and outcomes |
| `/dashboard/appointments` | Booked appointments |
| `/dashboard/ai-employees` | AI workforce management |
| `/dashboard/analytics` | Performance charts |
| `/dashboard/revenue` | Revenue tracking |
| `/dashboard/billing` | Subscription and Stripe billing |

## Stripe Setup

1. Create products and prices in the [Stripe Dashboard](https://dashboard.stripe.com)
2. Add price IDs to `.env` (see `.env.example`)
3. Set up a webhook endpoint pointing to `/api/stripe/webhook`
4. Enable the Customer Portal in Stripe settings

Plans: **Starter** ($149), **Professional** ($349), **Business** ($699), **Enterprise** (custom)

## Auth Routes

| Route | Description |
|-------|-------------|
| `/signup` | Create a new account |
| `/login` | Sign in |
| `/forgot-password` | Request password reset |
| `/reset-password?token=...` | Set new password |
| `/verify-email` | Email verification |
| `/onboarding` | Post-signup onboarding wizard |

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth pages (login, signup, etc.)
│   ├── api/              # API routes (auth, onboarding, stripe)
│   ├── dashboard/        # Business dashboard
│   └── onboarding/       # Onboarding wizard
├── components/
│   ├── auth/             # Auth forms and layout
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Marketing page sections
│   ├── onboarding/       # Onboarding wizard
│   └── ui/               # Reusable UI components
├── lib/                  # Auth, database, email, validations
└── middleware.ts         # Route protection
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:deploy` | Apply pending migrations to the database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Vercel Deployment

Set these environment variables in **Vercel → Project → Settings → Environment Variables** for **Production** and **Preview**. Enable each variable for **Build** and **Runtime**:

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | PostgreSQL connection string. For Neon/Supabase, include `?sslmode=require`. |
| `DIRECT_URL` | Recommended | Direct (non-pooled) connection for migrations. On Neon, use the non-pooled URL. If omitted, the build falls back to `DATABASE_URL`. |
| `AUTH_SECRET` | Yes | Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Recommended | Set to `true` on Vercel |
| `AUTH_URL` | Optional | Defaults to `https://<your-vercel-domain>` via `VERCEL_URL` |
| `RESEND_API_KEY` | Optional | Emails log to server console if omitted |

### Vercel build settings

The repo includes `vercel.json` so every deploy runs migrations before the app builds:

- **Build Command:** `npm run vercel-build`
- **What it runs:** `prisma generate` → `prisma migrate deploy` → `next build`

In **Vercel → Project → Settings → Build & Deployment**, leave the Build Command empty (use `vercel.json`) or set it explicitly to:

```bash
npm run vercel-build
```

Do **not** override it to `next build` only — that skips migrations and causes `P2021` (table does not exist).

### Apply migrations immediately (one-time fix)

If production is already deployed but tables are missing, run this locally with your production `DATABASE_URL`:

```bash
DATABASE_URL="your-production-url" DIRECT_URL="your-direct-url" npm run db:deploy
```

Then redeploy on Vercel so future deploys keep the schema in sync.

Check deployment health after configuring variables:

```bash
curl https://your-app.vercel.app/api/health
```

A healthy deployment returns `"status": "ok"` with database connected.

## Email in Development

Without a `RESEND_API_KEY`, verification and password reset emails are logged to the server console. Check your terminal for links when testing locally.
