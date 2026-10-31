# AI Mystery Room

A fictional, AI-powered investigation game based on the requirements in `spec.md`. Players submit a scenario, inspect a generated case file, review suspects and evidence, and submit a culprit theory.

## Run locally

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`. Gemini and MongoDB are optional for local development; without them, the app uses a local case generator and local storage.
4. Run `npm run dev` and open the Vite URL (usually `http://localhost:5173`).

Set `GEMINI_API_KEY` to enable Gemini case generation. Set `MONGODB_URI` to persist cases in MongoDB. The API key is only read by the server. The culprit ID and answer explanation are stripped from case responses and returned only after a guess is submitted.

## Deploy (Vercel frontend + Render API)

The repository includes `vercel.json` and `render.yaml` for this split deployment. The browser sends API requests to `VITE_API_URL`; local development leaves it empty and uses the Vite proxy.

1. Push this project to a GitHub repository. `.env` is ignored by Git; never commit API keys or database credentials.
2. In Render, create a new **Blueprint** from the repository. Render reads `render.yaml`. Set `MONGODB_URI` to your Atlas connection string and `GEMINI_API_KEY` to your Gemini key in the Render service environment. For the initial `CLIENT_ORIGIN` value, use `http://localhost:5173`; you will replace it after deploying the frontend. After the service deploys, copy its URL, for example `https://ai-mystery-room-api.onrender.com`.
3. In Vercel, import the same GitHub repository. Set the project environment variable `VITE_API_URL` to the Render service URL (no trailing slash), then deploy. `vercel.json` sets the Vite build and `dist` output directory.
4. Copy the Vercel production URL, then set Render's `CLIENT_ORIGIN` to that exact URL and redeploy the API. This allows the Vercel site to call the API.
5. Open the Vercel URL and create a case. Check the Render `/api/health` endpoint if the site cannot reach the API.

`MONGODB_URI` is needed for durable case storage in production; Render's local filesystem is not a durable database. `GEMINI_API_KEY` enables Gemini generation; without it, the server uses its built-in fictional case generator. The Render Blueprint uses the Free service plan; review Render's current plan limitations before relying on the service for always-on access.

Vercel documents Vite builds and environment variables in its [Vite deployment guide](https://vercel.com/docs/frameworks/frontend/vite) and [environment variable guide](https://vercel.com/docs/environment-variables). Render documents service setup in [Your First Render Deploy](https://render.com/docs/your-first-deploy) and environment variables in [Render's environment guide](https://render.com/docs/configure-environment-variables).

## API

- `GET /api/health` — service health
- `POST /api/cases` with `{ "scenario": "..." }` — create a fictional investigation
- `GET /api/cases/:id` — retrieve public case material (answer key omitted)
- `POST /api/cases/:id/submit` with `{ "suspectId": "s1" }` — validate a theory and return the reveal

Generated case material is fictional. Do not submit real personal or sensitive information.
