const http = require('http');
const PORT = process.env.PORT || 5000;

const data = {
  rates: [
    { country: 'US', rate: 3.75 },
    { country: 'EUR', rate: 2.25 },
    { country: 'UK', rate: 3.75 },
    { country: 'Japan', rate: 1.00 }
  ],
  inflation: [
    { country: 'US', value: 4.2, previous: 4.3, month: 'May 2026' },
    { country: 'EUR', value: 3.2, previous: 3.4, month: 'May 2026' },
    { country: 'UK', value: 3.8, previous: 4.0, month: 'April 2026' },
    { country: 'Japan', value: 1.9, previous: 2.0, month: 'May 2026' }
  ],
  inflationDetailed: [
    { 
      country: 'US', 
      cpi_yoy: 4.2, 
      cpi_mom: 0.3,
      cpi_3m_annualized: 3.8,
      ppi_yoy: 3.1,
      ppi_mom: 0.2,
      core_cpi: 2.9,
      shelter: 5.4,
      energy: 3.9
    },
    { 
      country: 'EUR', 
      cpi_yoy: 3.2, 
      cpi_mom: 0.1,
      cpi_3m_annualized: 2.9,
      ppi_yoy: 2.8,
      ppi_mom: 0.0,
      core_cpi: 2.5,
      energy: 10.9,
      services: 3.8
    },
    { 
      country: 'UK', 
      cpi_yoy: 3.8, 
      cpi_mom: 0.2,
      cpi_3m_annualized: 3.5,
      ppi_yoy: 2.1,
      ppi_mom: -0.1,
      core_cpi: 3.2,
      energy: 2.3,
      food: 6.2
    }
  ],
  labourMarket: [
    {
      country: 'US',
      nfp: 206000,
      nfp_prev: 195000,
      unemployment: 3.9,
      unemployment_prev: 4.0,
      participation_rate: 63.2,
      wage_growth_yoy: 4.0,
      last_report: 'June 2026'
    },
    {
      country: 'EUR',
      unemployment: 6.2,
      unemployment_prev: 6.5,
      wage_growth_yoy: 3.2,
      last_report: 'May 2026'
    },
    {
      country: 'UK',
      unemployment: 4.1,
      unemployment_prev: 4.2,
      wage_growth_yoy: 5.2,
      last_report: 'May 2026'
    }
  ],
  pmi: [
    {
      country: 'US',
      manufacturing_pmi: 51.2,
      services_pmi: 54.3,
      composite: 53.2,
      last_report: 'June 2026'
    },
    {
      country: 'EUR',
      manufacturing_pmi: 48.5,
      services_pmi: 52.1,
      composite: 50.8,
      last_report: 'June 2026'
    },
    {
      country: 'UK',
      manufacturing_pmi: 49.3,
      services_pmi: 53.5,
      composite: 52.0,
      last_report: 'June 2026'
    }
  ],
  fxPairs: [
    { pair: 'EUR/USD', rate: 1.1683, change: 0.25 },
    { pair: 'GBP/USD', rate: 1.3400, change: 0.15 },
    { pair: 'USD/JPY', rate: 159.40, change: -0.30 },
    { pair: 'AUD/USD', rate: 0.6750, change: 0.10 }
  ],
  commodities: [
    { name: 'Brent Crude', price: 95.50, change: -1.20 },
    { name: 'Gold', price: 1945.50, change: 0.85 },
    { name: 'Silver', price: 24.75, change: 0.15 }
  ],
  news: [
    { title: 'Fed Signals Pause in Rate Hikes', source: 'Reuters', category: 'Fed', impact: 'High', published: new Date().toISOString(), summary: 'New Fed Chair hints at end of tightening cycle' },
    { title: 'ECB Hikes 25bps; More to Come', source: 'Bloomberg', category: 'ECB', impact: 'High', published: new Date().toISOString(), summary: 'ECB raises to 2.25%, expects additional hikes' },
    { title: 'US NFP Beat Expectations at 206K', source: 'MarketWatch', category: 'Labour', impact: 'High', published: new Date().toISOString(), summary: 'June payrolls exceed forecast; unemployment edges up to 3.9%' },
    { title: 'PPI Inflation Moderates in May', source: 'Financial Times', category: 'Inflation', impact: 'Medium', published: new Date().toISOString(), summary: 'Producer prices rise 3.1% YoY, down from 3.4% prior month' }
  ],
  financialJuiceUpdates: [
    {
      title: 'G10 Macro Flash: Policy Divergence Accelerates',
      source: 'Financial Juice',
      category: 'G10 Analysis',
      published: new Date().toISOString(),
      summary: 'ECB hiking while Fed signals pause; significant implications for EUR/USD and carry trades',
      key_points: ['ECB hawkish tilt', 'Fed pivot expected', 'Real yield divergence widening', 'Risk to equity markets']
    },
    {
      title: 'USD/JPY Technical Break: 160 Level Critical',
      source: 'Financial Juice',
      category: 'FX Analysis',
      published: new Date(Date.now() - 30*60000).toISOString(),
      summary: 'MoF intervention warnings escalate as USD/JPY approaches 160; implications for EM carry',
      key_points: ['MoF intervention risk', 'BoJ yield curve control', 'Yen weakness structural', 'Hedge demand rising']
    },
    {
      title: 'Commodities: Energy Complex Under Pressure',
      source: 'Financial Juice',
      category: 'Commodities',
      published: new Date(Date.now() - 60*60000).toISOString(),
      summary: 'Brent crude consolidating near $95; geopolitical premium fading as supply fears ease',
      key_points: ['Hormuz tension easing', 'Demand concerns persist', 'OPEC+ production stable', 'Seasonal headwinds ahead']
    },
    {
      title: 'UK Labour Market Tightening: Wage Growth Sticky',
      source: 'Financial Juice',
      category: 'Labour Markets',
      published: new Date(Date.now() - 90*60000).toISOString(),
      summary: 'UK wage growth hits 5.2% YoY; BoE faces dilemma between growth concerns and inflation',
      key_points: ['Wage growth accelerating', 'Unemployment falling', 'Services inflation sticky', 'BoE rate hikes likely paused']
    }
  ],
  calendar: [
    { date: '2026-07-20', country: 'US', event: 'CPI Release', previous: 4.3, forecast: 4.2, actual: null, importance: 'High' },
    { date: '2026-07-22', country: 'US', event: 'NFP Release', previous: 195000, forecast: 185000, actual: null, importance: 'High' },
    { date: '2026-07-30', country: 'US', event: 'FOMC Decision', previous: 3.50, forecast: 3.50, actual: null, importance: 'High' },
    { date: '2026-08-05', country: 'EUR', event: 'ECB Decision', previous: 2.25, forecast: 2.50, actual: null, importance: 'High' }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.url === '/api/inflation-detailed') {
    res.writeHead(200);
    res.end(JSON.stringify({ inflationDetailed: data.inflationDetailed }));
  } else if (req.url === '/api/labour-market') {
    res.writeHead(200);
    res.end(JSON.stringify({ labourMarket: data.labourMarket }));
  } else if (req.url === '/api/pmi') {
    res.writeHead(200);
    res.end(JSON.stringify({ pmi: data.pmi }));
  } else if (req.url === '/api/news') {
    res.writeHead(200);
    res.end(JSON.stringify({ news: data.news }));
  } else if (req.url === '/api/financial-juice') {
    res.writeHead(200);
    res.end(JSON.stringify({ updates: data.financialJuiceUpdates }));
  } else if (req.url === '/api/calendar') {
    res.writeHead(200);
    res.end(JSON.stringify({ calendar: data.calendar }));
  } else if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Macro Dashboard API' }));
  }
});

server.listen(PORT, () => {
  console.log('Macro Dashboard API running on port ' + PORT);
});
