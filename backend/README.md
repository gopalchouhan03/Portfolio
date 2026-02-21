# Portfolio Backend

A minimal Express backend for the portfolio project.

Features:
- Visitor count endpoints (GET, POST increment, protected reset)
- Uses file-based storage via `lowdb` by default
- Optional MongoDB support when `MONGODB_URI` is provided

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
- `MONGODB_URI` (optional) — if set, MongoDB will be used instead of file storage
- `ADMIN_SECRET` — secret used to protect reset endpoint

Deploy
- Deploy to Render or Railway for an easy free option. If you use Vercel, deploy this as a separate project (Vercel supports Node services on their serverless functions but a simple Express service is easier on Render/Railway).
