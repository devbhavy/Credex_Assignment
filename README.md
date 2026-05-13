# CredLens — AI Spend Audit Tool

CredLens is a free audit tool for startup founders and engineering managers who want to know if they're overspending on AI tools. Input your stack, get an instant breakdown of savings opportunities, and share the report with your team.

**Live URL:** [https://credex-assignment-teal.vercel.app/](https://credex-assignment-teal.vercel.app/)  
**GitHub:** [https://github.com/devbhavy/Credex_Assignment](https://github.com/devbhavy/Credex_Assignment)

---

## Screenshots

### Landing

![CredLens landing page](screenshots/Landing.png)

### Create audit

![Create audit flow](screenshots/CreateAudit.png)

### Audit result

![Audit results view](screenshots/Audit_Result.png)

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (or Supabase account)

### Install & Run Locally

From the repository root (after `git clone`, the folder is usually `Credex_Assignment`):

**1. Backend**

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment variables](#environment-variables)). Then apply the database schema and start the API:

```bash
npx prisma migrate dev
npm run dev
```

The server listens on the port set by `PORT` in `.env` (for example `http://localhost:3000`). Health check: `GET /app/health`.

**2. Frontend** (separate terminal)

```bash
cd frontend
npm install
```

Create `frontend/.env` with `VITE_BACKEND_URL` pointing at your running API, for example:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

Then:

```bash
npm run dev
```

The Vite app runs at `http://localhost:5173` (default).

### Environment Variables

**`backend/.env`**

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | API port (e.g. `3000`). |
| `DATABASE_URL` | Yes | PostgreSQL connection string (local or Supabase). |
| `OPENROUTER_API_KEY` | Yes | OpenRouter key for the AI summary paragraph. |
| `BREVO_PASS` | Yes | Brevo API key (used with `@getbrevo/brevo` for transactional email). |
| `FRONTEND_URL` | Yes | Public frontend origin for email links; no trailing slash (e.g. `http://localhost:5173`). |
| `BREVO_SENDER_EMAIL` | No | Verified sender address in Brevo; defaults if unset. |
| `BREVO_SENDER_NAME` | No | Display name on outbound mail; defaults if unset. |

Example (replace placeholders with your values):

```bash
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
OPENROUTER_API_KEY=your_openrouter_key
BREVO_PASS=your_brevo_api_key
FRONTEND_URL=http://localhost:5173
# Optional:
# BREVO_SENDER_EMAIL=you@yourdomain.com
# BREVO_SENDER_NAME=CredLens
```

**`frontend/.env`**

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACKEND_URL` | Yes | Base URL of the running API (e.g. `http://localhost:3000`). |

```bash
VITE_BACKEND_URL=http://localhost:3000
```

### Deploy

- **Frontend** — push to GitHub, import in Vercel, set env vars
- **Backend** — deploy to Render, set env vars, connect to Supabase

---

## Decisions

1. **Prisma over raw SQL** — Type-safe queries out of the box. Schema
   changes are trackable and reversible via migrations. Slight overhead
   but worth it for a week-long build.

2. **JSONB for tools and recommendations** — The shape of each audit
   varies (2 tools vs 8 tools). Storing as JSONB avoids a complex
   relational schema while keeping the data queryable if needed later.

3. **Share token separate from internal ID** — Internal UUIDs are never
   exposed to the frontend. The share token is a separate UUID used only
   for public URLs, so even if guessed it reveals no sensitive data.

4. **Rule-based audit engine, not AI** — The audit math is hardcoded
   rules. AI is only used for the summary paragraph. A finance person
   reading the recommendations should be able to verify every number
   manually — that's not possible with an LLM doing the math.

5. **Value before email** — Email is captured after the audit is shown,
   never before. Hiding results behind a form would reduce trust and
   completion rate. The email is a reward for users who found value,
   not a gate.