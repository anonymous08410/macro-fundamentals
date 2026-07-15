import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cron from 'node-cron';
import { fetchAllData } from './scripts/fetchData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const dbPath = join(__dirname, 'macro.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
const initDB = () => {
  db.serialize(() => {
    // Rates table
    db.run(`
      CREATE TABLE IF NOT EXISTS rates (
        id INTEGER PRIMARY KEY,
        country TEXT UNIQUE,
        rate REAL,
        updated_at TEXT
      )
    `);

    // Inflation table
    db.run(`
      CREATE TABLE IF NOT EXISTS inflation (
        id INTEGER PRIMARY KEY,
        country TEXT UNIQUE,
        value REAL,
        previous REAL,
        updated_at TEXT
      )
    `);

    // Yields table
    db.run(`
      CREATE TABLE IF NOT EXISTS yields (
        id INTEGER PRIMARY KEY,
        country TEXT,
        tenor TEXT,
        value REAL,
        updated_at TEXT,
        UNIQUE(country, tenor)
      )
    `);

    // FX Pairs table
    db.run(`
      CREATE TABLE IF NOT EXISTS fx_pairs (
        id INTEGER PRIMARY KEY,
        pair TEXT UNIQUE,
        rate REAL,
        change REAL,
        updated_at TEXT
      )
    `);

    // Commodities table
    db.run(`
      CREATE TABLE IF NOT EXISTS commodities (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        price REAL,
        change REAL,
        updated_at TEXT
      )
    `);

    // News table
    db.run(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY,
        title TEXT,
        source TEXT,
        url TEXT UNIQUE,
        published_at TEXT,
        category TEXT
      )
    `);

    // Economic Calendar table
    db.run(`
      CREATE TABLE IF NOT EXISTS calendar (
        id INTEGER PRIMARY KEY,
        country TEXT,
        event TEXT,
        forecast REAL,
        actual REAL,
        previous REAL,
        release_date TEXT,
        importance TEXT
      )
    `);
  });
};

initDB();

// Routes

// Get all dashboard data
app.get('/api/dashboard', (req, res) => {
  const result = {};

  db.all('SELECT * FROM rates', (err, rates) => {
    if (err) console.error(err);
    result.rates = rates || [];

    db.all('SELECT * FROM inflation', (err, inflation) => {
      if (err) console.error(err);
      result.inflation = inflation || [];

      db.all('SELECT * FROM yields', (err, yields) => {
        if (err) console.error(err);
        result.yields = yields || [];

        db.all('SELECT * FROM fx_pairs ORDER BY pair', (err, fxPairs) => {
          if (err) console.error(err);
          result.fxPairs = fxPairs || [];

          db.all('SELECT * FROM commodities', (err, commodities) => {
            if (err) console.error(err);
            result.commodities = commodities || [];

            res.json(result);
          });
        });
      });
    });
  });
});

// Get FX pairs
app.get('/api/fx-pairs', (req, res) => {
  db.all('SELECT * FROM fx_pairs ORDER BY pair', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
  });
});

// Get commodities
app.get('/api/commodities', (req, res) => {
  db.all('SELECT * FROM commodities ORDER BY name', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
  });
});

// Get economic calendar
app.get('/api/calendar', (req, res) => {
  db.all('SELECT * FROM calendar ORDER BY release_date DESC LIMIT 50', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
  });
});

// Get news
app.get('/api/news', (req, res) => {
  const category = req.query.category || '';
  let query = 'SELECT * FROM news ORDER BY published_at DESC LIMIT 100';
  let params = [];

  if (category) {
    query = 'SELECT * FROM news WHERE category LIKE ? ORDER BY published_at DESC LIMIT 100';
    params = [`%${category}%`];
  }

  db.all(query, params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
  });
});

// Get yields
app.get('/api/yields', (req, res) => {
  db.all('SELECT * FROM yields ORDER BY country, tenor', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data || []);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Scheduled data fetch every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running scheduled data fetch...');
  await fetchAllData(db);
});

// Manual trigger for data fetch
app.post('/api/refresh', async (req, res) => {
  await fetchAllData(db);
  res.json({ status: 'Data refresh triggered' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initial data fetch on startup
  setTimeout(() => fetchAllData(db), 2000);
});

export { db };
