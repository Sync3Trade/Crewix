# Fix Vercel Stuck on Old Commit

If Vercel shows commit `7f2ab24` ("Initial commit") but GitHub `main` is at `76fc301` or newer, the production domain is pinned to an old deployment — reconnecting Git alone does not fix this.

## Quick check

```bash
curl https://vertexwork.vercel.app/api/version
```

- **404 or HTML** → still on old deployment
- **JSON with `"commit": "76fc301..."`** → fixed

GitHub latest: https://github.com/Sync3Trade/Crewix/commits/main

---

## Fix 1: Manually create a deployment from `main` (fastest)

1. Open **Vercel → vertexwork → Deployments**
2. Click **Create Deployment** (top right)
3. Select repository **`Sync3Trade/Crewix`**
4. Branch: **`main`**
5. Confirm the commit is **not** `7f2ab24` — it should show a recent message like "Fix signup and sign-in flow"
6. Click **Deploy**
7. When the build finishes with **Ready**, open that deployment → **⋯ → Promote to Production**

Do **not** click Redeploy on the old `7f2ab24` deployment — that rebuilds the same old code.

---

## Fix 2: Delete the stuck production deployment

1. **Deployments** → find deployment `6wdPfibjC` (commit `7f2ab24`)
2. **⋯ → Delete** (or remove it from Production)
3. **Create Deployment** from `main` as above
4. **Promote to Production**

---

## Fix 3: Re-import the project (if Git never worked)

1. Note your environment variables from **Settings → Environment Variables** (copy them)
2. **Settings → General → Delete Project**
3. **Add New → Project → Import** `Sync3Trade/Crewix`
4. Re-add `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST`
5. Deploy — build command should be `node scripts/vercel-build.mjs` from `vercel.json`

---

## Fix 4: GitHub Actions auto-deploy (recommended long-term)

Add these secrets in **GitHub → Sync3Trade/Crewix → Settings → Secrets and variables → Actions**:

| Secret | Where to find it |
|--------|------------------|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel project → Settings → General → Project ID section, or `vercel project ls` |
| `VERCEL_PROJECT_ID` | Same as above |

The workflow `.github/workflows/deploy-vercel.yml` deploys on every push to `main`.

---

## Required Vercel environment variables

| Variable | Build + Runtime |
|----------|-----------------|
| `DATABASE_URL` | ✅ both |
| `AUTH_SECRET` | ✅ both |
| `AUTH_TRUST_HOST` | `true` |

Build command (from `vercel.json`):

```bash
node scripts/vercel-build.mjs
```

---

## If the new deployment build fails

Open **Build Logs** and look for:

```
VertexWork Vercel build
Commit: 76fc301...
STEP 2/4: prisma migrate deploy
```

If migrate fails, run once locally:

```bash
DATABASE_URL="your-production-url" npm run db:deploy
```

Then redeploy.
