# Visitor Counter Setup Guide

## Current Setup
- **Frontend API URL**: `https://portfolio-y6q9.onrender.com` (configured in `.env.local`)
- **Backend**: Node.js/Express running on Render

## To Make Visitor Counter Work

### Step 1: Verify Backend is Deployed
1. Go to: https://dashboard.render.com
2. Find your "portfolio" service
3. Check if the service is **"Live"** (green status)
4. If status is red/inactive, click **"Create"** → **"Web Service"** and link your GitHub repo

### Step 2: Configure Backend Environment Variables on Render
1. In Render dashboard, go to your Portfolio service
2. Click **"Environment"** tab
3. Add these variables:
   ```
   GITHUB_TOKEN=ghp_your_real_token_here
   GITHUB_USERNAME=gopalchouhan03
   PORT=5000
   ADMIN_SECRET=change-me
   MONGODB_URI=mongodb+srv://user:pass@cluster.net/portfolio (optional - uses file storage if not set)
   ```

### Step 3: Verify Backend is Running
- Check console logs in Render dashboard
- Should show: `Portfolio backend listening on port 5000`
- Test health check: Visit https://portfolio-y6q9.onrender.com/health
  - Should return JSON with status and visitor count

### Step 4: Check Browser Console
- Open your portfolio website
- Press **F12** to open Developer Tools
- Go to **Console** tab
- Look for logs starting with 🔄, ✅, or ❌
- This will show exactly where the request is failing

## Common Issues

### "Connection error" or "Failed to fetch"
- **Cause**: Backend service is not running or domain is wrong
- **Fix**: Check Render dashboard - ensure service is "Live"
- **Also check**: Is `.env.local` setting correct? Should be `https://portfolio-y6q9.onrender.com`

### "HTTP 503" or "Service Unavailable"
- **Cause**: Backend crashed or is starting up
- **Fix**: Redeploy from Render dashboard or check logs for errors

### "HTTP 401" or "Unauthorized"
- **Cause**: CORS issue
- **Fix**: Ensure frontend domain is in CORS whitelist in backend `index.js`

## Testing Locally
```bash
# Terminal 1: Start backend
cd backend
npm install
node index.js

# Terminal 2: Start frontend
cd frontend
npm run dev

# Then visit http://localhost:3000
```

For local testing, make sure to set:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Debug Steps
1. Open browser Console (F12) and check visitor counter logs
2. Check Render backend logs: Dashboard → Portfolio → Logs
3. Try visiting `/health` endpoint directly to verify backend is responding
4. If stuck, check that `backend/.env` file exists with proper values (don't commit secrets to git)
