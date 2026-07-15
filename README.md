# 🌍 Macro Fundamentals Dashboard

A **completely free**, open-source platform for real-time macroeconomic data aggregation. Track G10 central bank rates, inflation, yield curves, FX pairs, commodities, and economic calendar events — all in one dashboard.

**No subscriptions. No data limits. 100% free.**

## Features

✅ **Real-time G10 Data**
- Central bank policy rates (Fed, ECB, BoE, BoJ, RBNZ, Norges, SNB, BOC)
- CPI/HICP inflation rates
- Yield curves (2Y, 5Y, 10Y)

✅ **FX Market**
- 10+ major pairs (EUR/USD, GBP/USD, USD/JPY, AUD/USD, etc.)
- Live rates and daily changes

✅ **Commodities**
- Oil (Brent, WTI), Gold, Silver, Copper, Natural Gas

✅ **Economic Calendar**
- Scheduled releases with forecasts vs. actuals
- Importance flags (High/Medium/Low)
- 50+ upcoming events

✅ **News Feed**
- Filtered macro headlines
- Multiple sources aggregated
- Auto-updated every 30 minutes

✅ **Interactive Charts**
- Real-time Recharts (line, bar, pie)
- Policy rates vs. inflation comparison
- Historical trends

✅ **Institutional Design**
- Bloomberg-terminal-inspired dark theme
- Mobile responsive
- Fast performance

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Node.js + Express + SQLite |
| Frontend | React 18 + Vite + Recharts |
| Data Sources | FRED API, Yahoo Finance, NewsAPI (all free) |
| Hosting | Netlify (frontend) + Railway (backend) |
| Update Frequency | Every 30 minutes |

---

## Quick Start

### 1. Prerequisites

```bash
Node.js 16+ (https://nodejs.org)
Git
```

### 2. Clone & Install

```bash
git clone https://github.com/yourusername/macro-fundamentals.git
cd macro-fundamentals
npm install
```

### 3. Get Free API Keys

1. **FRED API** (US Macro Data)
   - Go to https://fredaccount.stlouisfed.org/login
   - Create account → Get API key

2. **NewsAPI** (Macro Headlines)
   - Go to https://newsapi.org
   - Sign up → Get free tier key

### 4. Setup Environment

Create `.env` in project root:

```env
PORT=5000
FRED_API_KEY=your_fred_key
NEWS_API_KEY=your_newsapi_key
```

### 5. Run Locally

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend (cd src && npm start)
npm start
```

Open http://localhost:3000 in your browser.

---

## Deployment (Free Tier)

### Deploy Backend to Railway (2 minutes)

1. Go to https://railway.app
2. Sign in with GitHub
3. Import your repository
4. Set environment variables (FRED_API_KEY, NEWS_API_KEY)
5. Deploy automatically

**You get a public URL:** `https://your-app-xxxx.railway.app`

### Deploy Frontend to Netlify (2 minutes)

1. Go to https://netlify.com
2. Sign in with GitHub
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Set env var: `REACT_APP_API_URL=https://your-railway-url`
7. Deploy

**Your site is live at:** `https://your-app-name.netlify.app`

> **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step guide**

---

## Project Structure

```
macro-fundamentals/
├── server.js                 # Express API server
├── package.json              # Backend dependencies
├── scripts/
│   └── fetchData.js          # Data fetching logic
├── src/
│   ├── Dashboard.jsx         # Main dashboard (tabs, charts)
│   ├── Dashboard.css         # Dashboard styling
│   ├── App.jsx               # App wrapper
│   ├── App.css               # App styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── macro.db                  # SQLite database (auto-created)
├── .env.example              # Environment template
├── .gitignore
├── DEPLOYMENT.md             # Detailed deployment guide
└── README.md                 # This file
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | All data (rates, inflation, yields, FX, commodities) |
| `/api/fx-pairs` | GET | FX pairs only |
| `/api/commodities` | GET | Commodities only |
| `/api/yields` | GET | Yield curves by country/tenor |
| `/api/calendar` | GET | Economic calendar (50 upcoming events) |
| `/api/news` | GET | News feed (filtered by category) |
| `/api/health` | GET | Server health check |
| `/api/refresh` | POST | Trigger manual data refresh |

**Example:**

```bash
curl http://localhost:5000/api/dashboard
```

Response:
```json
{
  "rates": [
    { "country": "US", "rate": 3.75, "updated_at": "2026-06-18T12:00:00Z" },
    { "country": "EUR", "rate": 2.25, "updated_at": "2026-06-18T12:00:00Z" },
    ...
  ],
  "inflation": [...],
  "fxPairs": [...],
  ...
}
```

---

## Customization

### Change Update Frequency

Edit `server.js`:

```javascript
// Default: every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  // For every 15 min: '*/15 * * * *'
  // For every hour: '0 * * * *'
  await fetchAllData(db);
});
```

### Add More Countries

Edit `scripts/fetchData.js`:

```javascript
async function fetchCentralBankRates() {
  const rates = [
    { country: 'US', rate: 3.75 },
    { country: 'EUR', rate: 2.25 },
    { country: 'Chile', rate: 11.25 },  // Add here
    ...
  ];
}
```

### Change Theme Colors

Edit `src/Dashboard.css` (CSS custom properties):

```css
:root {
  --bg-dark: #0f1419;          /* Background */
  --accent-blue: #3b82f6;      /* Primary accent */
  --accent-green: #10b981;     /* Up/positive */
  --accent-red: #ef4444;       /* Down/negative */
  --accent-amber: #f59e0b;     /* Neutral */
}
```

---

## Data Sources (All Free)

| Source | Data | Rate Limit | Notes |
|--------|------|-----------|-------|
| **FRED** | US macro (CPI, employment, rates) | 120/min | St. Louis Fed official data |
| **Yahoo Finance** | FX, commodities, yields | Unlimited | No key required; scraped |
| **NewsAPI** | Headlines, news aggregation | 100/day | Free tier sufficient |
| **Trading Economics** | Calendar, forecasts | Scrapable | Free tier |
| **Central Banks** | Official statements | Manual | Direct from ECB, Fed, BoE, BoJ, etc. |

**Update Schedule:**
- Rates: Daily (Central bank websites)
- Inflation: Monthly (FRED, official releases)
- FX: Every 30 minutes (Yahoo Finance)
- News: Every 30 minutes (NewsAPI)
- Calendar: Real-time (Trading Economics scrape)

---

## Performance

- **Dashboard Load:** ~1-2 seconds
- **Data Refresh:** Every 30 minutes (background job)
- **Database Size:** ~5-10MB (SQLite)
- **Free Tier Limits:** Not exceeded (Railway $5/mo + Netlify free tier)

---

## Troubleshooting

### Issue: "Failed to load data"

**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify `.env` file has FRED_API_KEY
3. Check browser console for CORS errors
4. Wait 30 seconds for first data fetch

### Issue: Frontend shows outdated data

**Solution:**
1. Backend update runs every 30 minutes automatically
2. Force refresh: POST to `/api/refresh` endpoint
3. Check server logs for fetch errors

### Issue: Railway deployment fails

**Solution:**
1. Ensure Node.js version set to 16+ in Railway dashboard
2. Check environment variables are set
3. View deployment logs in Railway console
4. Ensure GitHub repo is public

### Issue: Netlify build fails

**Solution:**
1. Verify `REACT_APP_API_URL` is set in Netlify env vars
2. Check build logs: Netlify Dashboard → Deploys → Build log
3. Clear cache & redeploy
4. Ensure React build succeeds locally first

---

## Performance Monitoring

Check backend health:

```bash
curl https://your-api-url/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-06-18T15:30:00Z"
}
```

Trigger manual data refresh:

```bash
curl -X POST https://your-api-url/api/refresh
```

---

## Contributing

Found a bug? Want to add features?

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

**Ideas for contributions:**
- Add more countries (G20, EM economies)
- Implement real-time WebSocket updates
- Add CoT positioning data
- Build mobile app (React Native)
- Create API wrapper library
- Add sentiment index (VIX, fear gauge)

---

## License

MIT License — Use, modify, distribute freely.

---

## Roadmap

- [ ] Real-time WebSocket updates (vs. 30-min polling)
- [ ] User authentication & saved searches
- [ ] Custom alerts (email, Telegram, Discord)
- [ ] CoT positioning reports
- [ ] EM & emerging market data
- [ ] Mobile app (iOS/Android)
- [ ] Advanced charting (TradingView Lightweight Charts)
- [ ] Data export (CSV, Excel, PDF)

---

## Support

**Questions?**
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment help
- Review `server.js` and `src/Dashboard.jsx` for code structure
- Check browser console (F12) for frontend errors
- View backend logs with `npm run dev`

**Want to report a bug?**
- Open an issue with:
  1. What you were doing
  2. What happened
  3. What you expected
  4. Logs/screenshots

---

## Author

Built by traders, for traders. 100% free, no paywalls, no tracking.

**Happy analyzing!** 📊📈

---

## Disclaimer

This dashboard aggregates **public, free data sources**. Data is provided as-is for informational purposes only. Not investment advice. Always verify critical data directly with official sources (Fed, ECB, etc.) before making trading decisions.

---

**Deploy Now:** [Netlify](https://netlify.com) + [Railway](https://railway.app) — both have free tiers. You'll be live in <10 minutes.
