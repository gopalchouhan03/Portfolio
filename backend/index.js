require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

let dbClient = null;
let visitorsCollection = null;
let lowdb = null;

async function init() {
  if (MONGODB_URI) {
    dbClient = new MongoClient(MONGODB_URI);
    await dbClient.connect();
    const db = dbClient.db();
    visitorsCollection = db.collection('visitor_counts');
    // ensure a document exists
    await visitorsCollection.updateOne(
      { _id: 'visitors' },
      { $setOnInsert: { count: 0 } },
      { upsert: true }
    );
    console.log('Using MongoDB for storage');
  } else {
    const adapter = new JSONFile('db.json');
    // Provide default data to Low to avoid missing-default-data errors
    lowdb = new Low(adapter, { visitors: { count: 0 } });
    await lowdb.read();
    if (!lowdb.data) {
      lowdb.data = { visitors: { count: 0 } };
      await lowdb.write();
    }
    console.log('Using lowdb (file) for storage');
  }
}

app.get('/visitor-count', async (req, res) => {
  try {
    if (visitorsCollection) {
      const doc = await visitorsCollection.findOne({ _id: 'visitors' });
      return res.json({ count: doc?.count || 0 });
    }
    await lowdb.read();
    return res.json({ count: lowdb.data.visitors.count || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/visitor-count', async (req, res) => {
  try {
    const inc = Number(req.body.inc || 1);
    if (visitorsCollection) {
      const result = await visitorsCollection.findOneAndUpdate(
        { _id: 'visitors' },
        { $inc: { count: inc } },
        { returnDocument: 'after', upsert: true }
      );
      return res.json({ count: result.value.count });
    }
    await lowdb.read();
    lowdb.data.visitors.count = (lowdb.data.visitors.count || 0) + inc;
    await lowdb.write();
    return res.json({ count: lowdb.data.visitors.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected reset endpoint
app.post('/visitor-count/reset', async (req, res) => {
  const secret = req.headers['x-admin-secret'] || req.body.secret;
  if (secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (visitorsCollection) {
      await visitorsCollection.updateOne({ _id: 'visitors' }, { $set: { count: 0 } });
      return res.json({ count: 0 });
    }
    lowdb.data.visitors.count = 0;
    await lowdb.write();
    return res.json({ count: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

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

init().then(() => {
  app.listen(PORT, () => {
    console.log(`Portfolio backend listening on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize backend', err);
  process.exit(1);
});
