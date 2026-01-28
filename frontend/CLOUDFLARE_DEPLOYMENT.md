# Cloudflare Pages + Workers Deployment Setup

## Overview

This portfolio uses:
- **Cloudflare Pages**: Static HTML frontend (Next.js with `output: 'export'`)
- **Cloudflare Workers**: API endpoints for dynamic features
- **Cloudflare KV**: Data storage for visitor counts, project stats, and caching

## Setup Instructions

### 1. Create Cloudflare KV Namespace

```bash
wrangler kv:namespace create PORTFOLIO_KV
wrangler kv:namespace create PORTFOLIO_KV --preview
```

This will output IDs. Update `wrangler.toml` and `wrangler.json` with:
- `id`: Production namespace ID
- `preview_id`: Preview namespace ID

### 2. Set Environment Variables in Cloudflare

Go to your Cloudflare Pages project dashboard and add these environment variables:

**Production Environment:**
- `GITHUB_TOKEN` = your GitHub Personal Access Token
- `ADMIN_SECRET_KEY` = your admin secret key
- `NEXT_PUBLIC_SITE_URL` = https://portfolio-cv5.pages.dev
- `NEXT_PUBLIC_SITE_NAME` = Gopal's Portfolio

**Preview Environment:**
- Same as production

### 3. Deploy

The deployment happens automatically when you push to GitHub:

```bash
git add -A
git commit -m "Deploy: Move API routes to Cloudflare Workers"
git push origin main
```

## Architecture

```
Frontend (Static)
  /           → index.html (home page)
  /projects   → projects listing
  /blogs      → blogs listing
  /projects/[id]  → project detail
  /blogs/[id]     → blog detail
  /_next/*    → static assets

Backend (Cloudflare Workers)
  /api/visitor                    → Visitor tracking
  /api/projects/[id]/stats        → Project stats (likes, views)
  /api/projects/[id]/like         → Like a project
  /api/github/contributions       → GitHub contribution heatmap
```

## Storage

All data is stored in Cloudflare KV:
- `visitor:global` - total visitor count
- `visitor:daily:{DATE}` - daily visitor count
- `project:stats:{ID}` - project likes and views
- `github:contributions` - cached GitHub data

## Rate Limiting

- **Visitors**: 1 count per IP per hour
- **Likes**: 1 like per IP per project per minute
- **GitHub**: Cached for 24 hours

## Monitoring

Monitor API usage in Cloudflare Dashboard:
1. Navigate to your Workers
2. Check "Analytics" for request counts and errors
3. Check KV bindings for data usage

## Updating API Logic

To update API endpoints:
1. Edit files in `functions/api/` directory
2. The changes deploy automatically on git push
3. No rebuilding of frontend needed

## Troubleshooting

**KV not found errors:**
- Make sure KV namespace IDs are correct in wrangler files
- Ensure environment variables are set in Cloudflare dashboard

**API returning 500:**
- Check Cloudflare Workers Analytics for error logs
- Verify GITHUB_TOKEN and ADMIN_SECRET_KEY are set

**Static pages not loading:**
- Clear browser cache
- Check that Pages build completed successfully
