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
5. **Dashboard** at `/dashboard` — placeholder until full dashboard is built

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
│   ├── api/              # API routes (auth, onboarding)
│   ├── dashboard/        # Protected dashboard placeholder
│   └── onboarding/       # Onboarding wizard
├── components/
│   ├── auth/             # Auth forms and layout
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
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Email in Development

Without a `RESEND_API_KEY`, verification and password reset emails are logged to the server console. Check your terminal for links when testing locally.
