require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration for portfolio domain
const corsOptions = {
  origin: ['http://localhost:3000', 'https://portfolio-y6q9.onrender.com', 'https://gopalxportfolio.vercel.app'],
  credentials: true,
  methods: ['GET', 'OPTIONS'],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

// GitHub contributions proxy (GraphQL)
app.get('/api/github/contributions', async (req, res) => {
  try {
    const username = GITHUB_USERNAME;
    const token = GITHUB_TOKEN;
    if (!username || !token) return res.status(400).json({ success: false, error: 'GitHub credentials not configured' });

    const query = `
      query {
        user(login: "${username}") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    const ghRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!ghRes.ok) {
      const text = await ghRes.text();
      console.error('GitHub API error:', ghRes.status, text);
      return res.status(502).json({ success: false, error: 'GitHub API error' });
    }

    const json = await ghRes.json();
    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    const totalContributions = json.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0;

    return res.json({ success: true, data: { username, totalContributions, weeks } });
  } catch (err) {
    console.error('Error fetching GitHub contributions:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch GitHub contributions' });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    githubConfigured: !!(GITHUB_TOKEN && GITHUB_USERNAME),
  });
});

app.listen(PORT, () => {
  console.log(`Portfolio backend listening on port ${PORT}`);
});
