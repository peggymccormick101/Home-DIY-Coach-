# Home DIY Coach

Turn a home improvement idea, a budget, and a target finish date into a
concrete, step-by-step project plan — complete with a shopping list, cost
and timeline estimates, and a chat assistant that remembers your project so
you can ask follow-up questions.

## How it works

1. Enter your project idea, a short description, your budget in USD, and a
   target finish date.
2. The backend asks Claude to turn that into a structured plan: an ordered
   task list, a shopping list with estimated costs, and an overall cost /
   duration estimate.
3. The plan is saved (SQLite), so you can come back to it later.
4. Ask follow-up questions on the project page — the assistant has full
   context of the plan and your conversation history.

Photo examples of the finished project are not included in this MVP and can
be added later.

## Stack

- **Backend:** FastAPI + SQLAlchemy (SQLite) + the Claude API (`anthropic`
  Python SDK)
- **Frontend:** React (Vite) + React Router

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # then edit .env and set ANTHROPIC_API_KEY
.venv/bin/uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000` (docs at `/docs`). It creates
`backend/home_diy_coach.db` (SQLite) on first run.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies `/api` requests to the
backend on port 8000 (see `vite.config.js`).

## API

- `POST /api/projects` — create a project; generates and returns the plan
- `GET /api/projects` — list saved projects
- `GET /api/projects/{id}` — get a project's full plan, shopping list, and
  chat history
- `POST /api/projects/{id}/ask` — ask a question about a project

## Deployment (Render)

The app deploys as a single service: a Docker image builds the React
frontend, then FastAPI serves both the API (`/api/*`) and the built
frontend (everything else) from one process.

1. Push this repo to GitHub (already done if you're reading this from there).
2. On [render.com](https://render.com), sign up / log in, then **New >
   Blueprint**, and point it at this repo. Render reads `render.yaml`
   automatically and creates the service.
3. When prompted, enter your `ANTHROPIC_API_KEY` (and `ANTHROPIC_WORKSPACE_ID`
   if your account requires one — see `backend/.env.example`) as the
   service's environment variables. These are entered directly in Render's
   dashboard, never committed to the repo.
4. Deploy. Render builds the Docker image (`Dockerfile` at the repo root)
   and gives you a public `https://home-diy-coach-xxxx.onrender.com` URL.
5. To install it on your phone's home screen: open the URL in your mobile
   browser, then use "Add to Home Screen" (Safari) or "Install app" (Chrome).
6. On the service's **Settings** page, confirm **Auto-Deploy** is set to
   "On Commit" so future pushes to the branch Render is watching deploy
   automatically.

**Note on data:** the free tier's disk is ephemeral — the SQLite database
(saved projects) resets on every redeploy. That's fine for personal/testing
use; if persistence across deploys matters later, that would mean adding a
Render persistent disk or switching to a hosted database.
