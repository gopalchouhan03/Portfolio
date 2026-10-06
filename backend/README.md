# Portfolio Backend

A small Express service used to proxy GitHub contribution data without exposing
the GitHub token in the frontend. Website analytics are handled by Vercel
Analytics in the frontend.

Quick start
1. Copy `.env.example` to `.env` and edit values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run locally:

```bash
npm run dev
# or
npm start
```

Environment variables
- `PORT` (default 5000)
- `GITHUB_TOKEN` — GitHub token used by the contributions proxy
- `GITHUB_USERNAME` — GitHub username whose contributions are requested

Deploy
- Deploy to Render or Railway for an easy free option. If you use Vercel, deploy this as a separate project (Vercel supports Node services on their serverless functions but a simple Express service is easier on Render/Railway).
