# Pocket Fund — Social Command Center

Internal dashboard for managing Pocket Fund's social media across Instagram, LinkedIn, YouTube, and X.

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000` — works immediately with built-in mock data, no Supabase needed.

---

## Full Deployment: GitHub → Supabase → Vercel

Follow these 3 steps in order.

---

### STEP 1 — Push to GitHub

**1a. Create a new repo on GitHub:**
- Go to https://github.com/new
- Name: `pocket-fund-social`
- Visibility: **Private**
- Do NOT check "Add a README" (we have our own)
- Click **Create repository**

**1b. Push this code:**
```bash
git init
git add .
git commit -m "Initial commit: Pocket Fund Social Command"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pocket-fund-social.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

### STEP 2 — Set Up Supabase

**2a. Create a Supabase project:**
1. Go to https://supabase.com → Sign up / Sign in
2. Click **New Project**
3. Project name: `pocket-fund-social`
4. Set a **database password** (save it somewhere safe!)
5. Region: **South Asia (Mumbai)** for best latency
6. Click **Create new project** — wait ~2 minutes

**2b. Create the database tables:**
1. In your Supabase project, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase/migrations/001_schema.sql` from this project
4. **Copy ALL the contents** and paste into the SQL editor
5. Click **Run** → should show "Success"

**2c. Insert seed data:**
1. Click **New Query** again
2. Open `supabase/migrations/002_seed.sql`
3. **Copy ALL the contents** and paste
4. Click **Run** → should show "Success"

**2d. Verify it worked:**
1. Click **Table Editor** (left sidebar)
2. You should see tables: `users`, `posts`, `tasks`, `links`, `comments`, `chat_messages`, `audit_logs`, `approval_logs`, `metrics`
3. Click on `users` — you should see 11 team members

**2e. Get your API keys:**
1. Go to **Settings** → **API** (left sidebar → gear icon → API)
2. Copy these two values:

| Name | Where to find it |
|------|-----------------|
| **Project URL** | Under "Project URL" — looks like `https://abcdef.supabase.co` |
| **anon public key** | Under "Project API keys" → `anon` `public` — starts with `eyJ...` |

---

### STEP 3 — Deploy on Vercel

**3a. Connect GitHub to Vercel:**
1. Go to https://vercel.com → Sign in with your **GitHub account**
2. Click **Add New** → **Project**
3. Find and select `pocket-fund-social` from your repos
4. Click **Import**

**3b. Add environment variables:**

Before clicking Deploy, scroll down to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT_ID.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (your anon key) |

> Paste the actual values you copied from Supabase in Step 2e.

**3c. Deploy:**
1. Click **Deploy**
2. Wait ~2 minutes for the build
3. Done! Your app is live at `https://pocket-fund-social.vercel.app`

---

## After Deployment

Every time you push to `main` on GitHub, Vercel automatically redeploys.

```bash
# Make changes, then:
git add .
git commit -m "your change description"
git push
```

Vercel picks it up and deploys in ~1 minute.

---

## Local Development with Supabase

To connect your local dev server to Supabase:

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and fill in your Supabase values
# Then restart dev server
npm run dev
```

---

## Project Structure

```
pocket-fund-social/
├── app/
│   ├── layout.js          # Root HTML layout
│   ├── page.js            # Main page (loads Dashboard)
│   └── globals.css        # Base styles
├── components/
│   └── Dashboard.jsx      # Full dashboard (900+ lines React)
├── hooks/
│   └── useSupabase.js     # React hooks for DB (migration-ready)
├── lib/
│   ├── supabase.js        # Supabase client setup
│   └── db.js              # All database queries
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql # Tables, indexes, RLS, realtime
│       └── 002_seed.sql   # Team + sample content data
├── package.json
├── next.config.js
├── jsconfig.json
└── .env.local.example
```

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Realtime**: Supabase Realtime (for chat & post updates)
- **Auth**: Team-select login (upgradeable to Supabase Auth)
