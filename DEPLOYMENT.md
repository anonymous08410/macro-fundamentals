# Macro Fundamentals Dashboard - Setup & Deployment Guide

## Overview
A completely **free**, open-source macro fundamentals platform showing G10 rates, inflation, yields, FX pairs, commodities, economic calendar, and macro news.

**Tech Stack:**
- Backend: Node.js + Express + SQLite
- Frontend: React + Recharts
- Deployment: Netlify (frontend) + Railway/Render (backend)
- Data Sources: FRED API, Yahoo Finance, NewsAPI (all free tier)

---

## LOCAL SETUP

### Prerequisites
- Node.js 16+ (https://nodejs.org)
- npm or yarn
- Git

### 1. Clone & Install Dependencies

```bash
# Backend
cd macro-fundamentals
npm install

# Frontend (in separate terminal or folder)
cd frontend
npm install
```

### 2. Set Environment Variables

Create `.env` file in backend root:

```env
PORT=5000
FRED_API_KEY=your_fred_key_here
NEWS_API_KEY=your_newsapi_key_here
```

**Getting Free API Keys:**

**FRED API** (US Macro Data):
1. Go to https://fredaccount.stlouisfed.org/login
2. Create free account
3. Get your API key from settings

**NewsAPI** (News Feed):
1. Go to https://newsapi.org
2. Sign up for free tier
3. Get your API key

### 3. Run Backend Locally

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Run Frontend Locally

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

---

## DEPLOYMENT (Free Tiers)

### Option A: Netlify (Frontend) + Railway (Backend)

#### Step 1: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → Deploy from GitHub
4. Select your repo
5. Set environment variables:
   - `FRED_API_KEY`
   - `NEWS_API_KEY`
   - `PORT=5000`
6. Railway will auto-deploy when you push to main

**Get your Railway API URL:** After deployment, Railway gives you a public URL like `https://your-app-xxxx.railway.app`

#### Step 2: Deploy Frontend to Netlify

1. Go to https://netlify.com
2. Sign in with GitHub
3. Click "Add new site" → "Import existing project"
4. Select your GitHub repo
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `build` (if using Create React App) or `dist` (if using Vite)
6. Set environment variables:
   - `REACT_APP_API_URL=https://your-railway-url.railway.app`
7. Deploy

**Your site will be live at:** `https://your-app-name.netlify.app`

---

### Option B: Docker + Self-Hosted VPS (Advanced)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t macro-dashboard .
docker run -p 5000:5000 \
  -e FRED_API_KEY=your_key \
  -e NEWS_API_KEY=your_key \
  macro-dashboard
```

---

## PROJECT STRUCTURE

```
macro-fundamentals/
├── server.js                 # Express API
├── package.json              # Backend dependencies
├── scripts/
│   └── fetchData.js          # Data fetching logic
├── src/
│   ├── Dashboard.jsx         # Main dashboard component
│   ├── Dashboard.css         # Dashboard styling
│   ├── App.jsx               # App wrapper
│   └── App.css               # App styles
├── macro.db                  # SQLite database (auto-created)
├── .env.example              # Environment template
└── .gitignore
```

---

## DATA SOURCES (All Free)

| Source | Data | Limit | Notes |
|--------|------|-------|-------|
| **FRED** | US macro (CPI, unemployment, rates) | 120 calls/min | No key needed for basic use |
| **Yahoo Finance** | FX, commodities, yields | Unlimited | Scraped via axios |
| **NewsAPI** | Macro headlines | 100 req/day | Free tier sufficient for aggregate use |
| **Trading Economics** | Calendar, forecasts | Scrapable | Free tier; parse manually |

**Data Refresh Rate:** Every 30 minutes (configurable via cron)

---

## FEATURES

### Dashboard Tabs

1. **Overview** - Central bank rates, FX pairs, commodities at a glance
2. **Central Banks** - Policy rates, inflation, real rates for G10
3. **FX Pairs** - EUR/USD, GBP/USD, USD/JPY, AUD/USD, etc.
4. **Commodities** - Oil, gold, silver, copper prices
5. **Economic Calendar** - Scheduled releases, forecasts, actuals
6. **News Feed** - Macro headlines filtered by keyword

### Charts

- Interactive Recharts (bar, line, pie charts)
- Real-time data updates every 30 seconds
- Mobile responsive

---

## CUSTOMIZATION

### Add More Countries

Edit `scripts/fetchData.js`:

```javascript
const rates = [
  { country: 'Chile', rate: 11.25 },
  { country: 'Brazil', rate: 13.75 },
  // Add more
];
```

### Change Update Frequency

Edit `server.js` cron schedule:

```javascript
// Currently: every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  // Change to:
  // '*/15 * * * *' for every 15 minutes
  // '0 * * * *' for every hour
});
```

### Customize Dashboard Layout

Edit `src/Dashboard.css` to change colors, fonts, spacing.

---

## TROUBLESHOOTING

### Backend won't connect
- Check `FRED_API_KEY` and `NEWS_API_KEY` are set
- Ensure backend is running on port 5000
- Check CORS is enabled in `server.js`

### Frontend shows "No data"
- Wait 30 seconds for first data fetch
- Check browser console for errors
- Verify backend API URL in `.env`

### Railway deployment fails
- Push `.env` variables to Railway dashboard
- Check logs in Railway dashboard
- Ensure Node version is 16+

### Netlify build fails
- Clear cache and redeploy
- Check build logs for errors
- Verify `REACT_APP_API_URL` env var is set

---

## MONITORING & MAINTENANCE

### Monitor Data Freshness

Check `/api/health` endpoint:

```bash
curl https://your-api.railway.app/api/health
```

Returns:
```json
{ "status": "ok", "timestamp": "2026-06-18T12:00:00Z" }
```

### Manual Data Refresh

Trigger immediate refresh:

```bash
curl -X POST https://your-api.railway.app/api/refresh
```

### Database Backup

SQLite database is stored in `macro.db`. To back up:

```bash
cp macro.db macro.db.backup
```

---

## SCALING NOTES

- **Bottleneck:** Data fetching (currently free tier APIs)
- **To optimize:**
  - Use database caching for historical data
  - Add GraphQL for flexible queries
  - Implement Redis for session state
  - Add user authentication & saved searches

---

## LICENSE

Free & open source. Use, modify, distribute as you wish.

---

## SUPPORT

Issues? Check:
1. Backend logs: `npm start`
2. Frontend console: F12 → Console tab
3. Railway dashboard logs
4. API response: `/api/dashboard`

---

## NEXT STEPS

1. Deploy backend to Railway
2. Deploy frontend to Netlify
3. Test at your live URL
4. Customize as needed
5. Share with other macro traders!

Happy analyzing. 🚀
