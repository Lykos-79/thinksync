# ThinkSync

**ThinkSync** — an AI-powered, searchable note-taking web app built with modern web technologies. Turn your static notes into an interactive knowledge hub: create multiple notes, search instantly, and use the **Ask AI** action to summarize notes, generate quizzes, extract insights, and more.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture & Key Concepts](#architecture--key-concepts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install & Run (local)](#install--run-local)
- [Usage](#usage)
- [Database / Prisma](#database--prisma)
- [Deployment](#deployment)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Demo

Include a short GIF or screenshots in the repository `README` (recommended):

- Landing / auth screens
- Notes list + sidebar search
- Note editor / detail view
- Ask AI modal (summary/quiz generation)

(You can paste screenshots in `/assets` and reference them below.)

---

## Features

- Email / password authentication (Supabase)
- Create, edit, delete multiple notes
- Fast sidebar search across note titles & content
- Note detail view with code block support and basic formatting
- **Ask AI** button per note to:
  - Generate concise summaries
  - Create quizzes (MCQs / short answers) for revision
  - Extract key points or study flashcards
- Responsive UI with accessible components (shadcn/ui)
- Basic account settings and session management

---

## Tech Stack

- Frontend: **Next.js** + **TypeScript**
- Styling: **Tailwind CSS**
- UI Components: **shadcn/ui**
- Auth & Database: **Supabase**
- ORM: **Prisma**
- AI: **Google Gemini** (via API)
- Deployment: Vercel (recommended)

---

## Architecture & Key Concepts

- Client (Next.js) handles authentication flows and renders UI.
- Supabase handles user authentication, database (Postgres), and realtime events if used.
- Prisma provides typed DB access and migrations.
- Server-side API routes (Next.js API or app route handlers) proxy requests to the Gemini API to keep API keys secure.
- Ask AI flow:
  1. User clicks **Ask AI** on a note.
  2. Frontend calls an authenticated internal API route with the note ID (no direct client-to-Gemini requests).
  3. Server fetches note content, prepares prompt, calls Gemini, and returns structured response (summary / quiz / flashcards).

---

## Getting Started

### Prerequisites

- Node.js 18+ (or LTS)
- pnpm / npm / yarn
- Supabase account + project
- A Gemini API key (or any AI provider) stored as environment variable

### Environment Variables

Create a `.env` file in the project root with at least the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GEMINI_API_KEY=sk-...
NEXTAUTH_SECRET=some-random-secret
# Optional
SUPABASE_SERVICE_ROLE_KEY=...
```

> **Security note:** Do not commit `.env` or secret keys to git. Use deployment provider secret settings for production.

### Install & Run (local)

1. Install dependencies

```bash
pnpm install
# or
npm install
```

2. Generate Prisma client & run migrations (if you have migrations)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

3. Start the development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Usage

- Sign up or log in using the Supabase auth flow.
- Create a new note from the dashboard.
- Use the left sidebar to search notes by title or content — search is incremental and fast.
- Open any note and click **Ask AI** to choose an action:
  - **Summary** — short summary or TL;DR
  - **Quiz** — generate 5–10 MCQs or short answer questions
  - **Extract** — list key points / flashcards

**Tip:** Keep prompts concise and include the note's structure (headings, code blocks) — the backend formats the prompt for Gemini automatically.

---

## Database / Prisma

A minimal example `Note` model (Prisma):

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  notes     Note[]
  createdAt DateTime @default(now())
}

model Note {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

Adjust according to your app’s needs (tags, collaborators, version history, etc.).

---

## Deployment

Recommended: **Vercel** for Next.js apps.

1. Push the repo to GitHub.
2. Create a new Vercel project and connect your repo.
3. Add environment variables in Vercel dashboard (same names as `.env`).
4. Set build command: `pnpm build` (or `npm run build`) and output directory: default.
5. Deploy.

**Database:** Use Supabase production DB; run Prisma migrations against it.

---

## Development Notes

- Keep Gemini API calls server-side to protect secrets and control prompt/response handling.
- Rate-limiting / queuing: consider adding a simple queue or rate-limiter if you expect heavy usage.
- Caching: cache generated summaries/quizzes to avoid repeated API calls.
- Observability: log API latencies, errors; add lightweight Sentry/LogRocket if required.

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes and push
4. Open a PR describing your changes

Please include unit or integration tests for new features.

---

## Troubleshooting

- `Prisma` errors: ensure `DATABASE_URL` is correct and migrations have been run.
- Auth issues: verify Supabase keys and redirect URLs in Supabase auth settings.
- Gemini errors: check API key, usage limits, and the server-side request formatting.

---

## License

MIT

---

## Contact

Your Name — `kumarabhisekh0111@gmail.com`
Project: ThinkSync
