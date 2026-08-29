# FLASHBACK: Naija Edition 🇳🇬

A database-backed Nigerian nostalgia trivia game built with Next.js, TypeScript, PostgreSQL and Prisma.

## What is implemented

- Quick, exact-year, decade and category modes
- Balanced random selection from published, verified database questions
- No duplicate question inside a round
- 60-second Quick Flashback timer
- Difficulty and speed scoring where knowledge remains more valuable than speed
- Naija Nostalgia result score and category breakdown storage
- Shareable “beat my score” challenge links that preserve the exact ten-question set
- Three attempts per challenger, best-score mini leaderboards and creator result tracking
- Four selectable Nigerian presenter personalities with contextual commentary
- Evolving nostalgia identities based on cumulative category performance and games played
- Secure accounts with salted one-way password hashes and database sessions
- Global and weekly leaderboard data
- Private two-player rooms with codes, invite links, live progress, scores and rematches
- Admin workflow: Draft → Review → Approved → Published, plus Flagged and Archived
- Bulk JSON import validation for sources, years, answer/options and duplicate wording
- PostgreSQL indexes designed for 100,000+ records
- Responsive mobile UI and Render Blueprint

## Important data-quality note

The repository contains a small sourced starter set, not a falsely inflated 10,000-question bank. Production gameplay only uses records where `status=PUBLISHED` and `verified=true`. The importer intentionally creates new records as drafts so a human reviewer must validate them before publication.

To reach 10,000 verified questions, use the included import pipeline in editorial batches, review sources and ambiguity in `/admin`, and publish approved records. Exact-year games require at least ten published records for that year.

## Local setup

1. Install Node.js 20 or later and PostgreSQL.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `SESSION_SECRET` and `ADMIN_EMAIL`.
3. Install packages:

   ```bash
   npm install
   ```

4. Create the database and seed the starter questions:

   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

5. Start development:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

The account matching `ADMIN_EMAIL` becomes an admin when it registers.

## Bulk question import

Prepare a JSON array matching `questions.example.json`, then run:

```bash
npm run data:import -- ./your-questions.json
```

The import fails before writing if it finds malformed records, missing sources, invalid years, duplicate choices, answers absent from the choices, duplicate wording inside the file, or wording already stored in the database. Imported questions remain drafts.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

## Render deployment

### When `THROWBACK` is a subfolder in the repository

Set the Render service's **Root Directory** to `THROWBACK`. The commands themselves remain:

- Build command: `npm ci && npm run build`
- Start command: `npm start`

The included Blueprint also declares `rootDir: THROWBACK` for this repository layout.

### When FLASHBACK has its own repository

If the contents of `THROWBACK` are moved to the root of a dedicated repository, remove the `rootDir: THROWBACK` line from `render.yaml` and leave Render's Root Directory blank.

1. Push the project to GitHub.
2. In Render, choose **New → Blueprint** and select the repository.
3. Render creates PostgreSQL, installs packages, applies migrations, seeds idempotently and starts Next.js.
4. Add `ADMIN_EMAIL` in the web service environment if you need admin access.

The health endpoint is `/api/health`.
