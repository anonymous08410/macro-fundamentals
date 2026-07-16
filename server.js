const http = require('http');
const PORT = process.env.PORT || 5000;

const data = {
  topStats: {
    dot: { value: 53.6, change: 0.3, direction: 'up' },
    institutions: { value: 53.6, change: -2.1, direction: 'down' },
    retail: { value: 46.8, change: 1.2, direction: 'up' },
    oil: { value: 95.50, change: -2.92, direction: 'down' },
    gold: { value: 1945.27, change: -0.83, direction: 'down' },
    silver: { value: 24.98, change: -1.16, direction: 'down' },
    dxy: { value: 104.3, change: 0.4, direction: 'up' }
  },
  g10Data: {
    USD: {
      name: 'United States',
      rate: 3.75,
      inflation: 4.2,
      leadingIndicators: {
        ppi: { value: 3.1, change: -0.1, direction: 'down' },
        economicSentiment: { value: 93.5, change: 2.1, direction: 'up' },
        retailSales: { value: -0.4, change: 0.2, direction: 'down' },
        labourMarketIndex: { value: 65.3, change: -1.2, direction: 'down' }
      },
      themes: [
        { name: 'INFLATION', value: 4.2, sentiment: 'rising' },
        { name: 'GROWTH', value: 0.5, sentiment: 'falling' },
        { name: 'LABOUR', value: 3.9, sentiment: 'stable' },
        { name: 'POLICY', value: 'Unknown', sentiment: 'neutral' }
      ],
      macroData: {
        unemployment: 3.9,
        wageGrowth: 4.0,
        ppi_yoy: 3.1,
        ppi_mom: 0.2,
        nfp: 206000,
        nfp_prev: 195000,
        manufacturingPmi: 51.2,
        servicesPmi: 54.3,
        retailSales: -0.4,
        industrialProduction: 1.2,
        gdpGrowth: 0.8,
        cpi_yoy: 4.2,
        cpi_mom: 0.3,
        cpi_3m: 3.8,
        coreInflation: 2.9
      },
      recentReleases: [
        { event: 'Unemployment Rate', value: '3.9%', prev: '4.0%', impact: 'INLINE', time: '1h ago' },
        { event: 'Non Farm Payrolls', value: '206K', prev: '195K', impact: 'BEAT', time: '1h ago' },
        { event: 'Average Hourly Earnings YoY', value: '4.0%', prev: '3.8%', impact: 'INLINE', time: '1h ago' }
      ]
    },
    EUR: {
      name: 'Eurozone',
      rate: 2.25,
      inflation: 3.2,
      leadingIndicators: {
        ppi: { value: 2.8, change: 0.1, direction: 'up' },
        economicSentiment: { value: 88.2, change: -1.5, direction: 'down' },
        retailSales: { value: -0.8, change: -0.2, direction: 'down' },
        labourMarketIndex: { value: 62.1, change: 0.5, direction: 'up' }
      },
      themes: [
        { name: 'INFLATION', value: 3.2, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.1, sentiment: 'falling' },
        { name: 'LABOUR', value: 6.2, sentiment: 'falling' },
        { name: 'POLICY', value: '2.25%', sentiment: 'hiking' }
      ],
      macroData: {
        unemployment: 6.2,
        wageGrowth: 3.2,
        ppi_yoy: 2.8,
        ppi_mom: 0.0,
        manufacturingPmi: 48.5,
        servicesPmi: 52.1,
        retailSales: -0.8,
        industrialProduction: -0.5,
        gdpGrowth: 0.1,
        cpi_yoy: 3.2,
        cpi_mom: 0.1,
        cpi_3m: 2.9,
        coreInflation: 2.5
      },
      recentReleases: [
        { event: 'CPI Release', value: '3.2%', prev: '3.4%', impact: 'BEAT', time: '2h ago' },
        { event: 'Manufacturing PMI', value: '48.5', prev: '49.2%', impact: 'MISS', time: '3h ago' },
        { event: 'Unemployment Rate', value: '6.2%', prev: '6.5%', impact: 'BEAT', time: '1d ago' }
      ]
    },
    GBP: {
      name: 'United Kingdom',
      rate: 3.75,
      inflation: 3.8,
      leadingIndicators: {
        ppi: { value: 2.1, change: -0.1, direction: 'down' },
        economicSentiment: { value: 85.4, change: 1.2, direction: 'up' },
        retailSales: { value: 1.3, change: 0.4, direction: 'up' },
        labourMarketIndex: { value: 68.5, change: -0.8, direction: 'down' }
      },
      themes: [
        { name: 'INFLATION', value: 3.8, sentiment: 'stable' },
        { name: 'GROWTH', value: 0.6, sentiment: 'rising' },
        { name: 'LABOUR', value: 4.1, sentiment: 'stable' },
        { name: 'POLICY', value: 'Unknown', sentiment: 'neutral' }
      ],
      macroData: {
        unemployment: 4.1,
        wageGrowth: 5.2,
        ppi_yoy: 2.1,
        ppi_mom: -0.1,
        manufacturingPmi: 49.3,
        servicesPmi: 53.5,
        retailSales: 1.3,
        industrialProduction: 0.8,
        gdpGrowth: 0.5,
        cpi_yoy: 3.8,
        cpi_mom: 0.2,
        cpi_3m: 3.5,
        coreInflation: 3.2
      },
      recentReleases: [
        { event: 'Unemployment Rate', value: '4.1%', prev: '4.2%', impact: 'BEAT', time: '5h ago' },
        { event: 'Average Earnings Growth', value: '5.2%', prev: '5.0%', impact: 'BEAT', time: '5h ago' },
        { event: 'Retail Sales', value: '1.3%', prev: '0.9%', impact: 'BEAT', time: '1d ago' }
      ]
    },
    JPY: {
      name: 'Japan',
      rate: 1.00,
      inflation: 1.9,
      leadingIndicators: {
        ppi: { value: 1.5, change: 0.1, direction: 'up' },
        economicSentiment: { value: 79.3, change: -2.3, direction: 'down' },
        retailSales: { value: 0.2, change: -0.1, direction: 'down' },
        labourMarketIndex: { value: 55.2, change: 1.5, direction: 'up' }
      },
      themes: [
        { name: 'INFLATION', value: 1.9, sentiment: 'stable' },
        { name: 'GROWTH', value: -0.1, sentiment: 'falling' },
        { name: 'LABOUR', value: 2.5, sentiment: 'stable' },
        { name: 'POLICY', value: '1.00%', sentiment: 'hike' }
      ],
      macroData: {
        unemployment: 2.5,
        wageGrowth: 2.1,
        ppi_yoy: 1.5,
        ppi_mom: 0.1,
        manufacturingPmi: 50.8,
        servicesPmi: 51.2,
        retailSales: 0.2,
        industrialProduction: -0.8,
        gdpGrowth: 0.0,
        cpi_yoy: 1.9,
        cpi_mom: 0.1,
        cpi_3m: 1.6,
        coreInflation: 1.5
      },
      recentReleases: [
        { event: 'CPI Release', value: '1.9%', prev: '2.0%', impact: 'MISS', time: '2d ago' },
        { event: 'Industrial Production', value: '-0.8%', prev: '0.5%', impact: 'MISS', time: '3d ago' },
        { event: 'Unemployment Rate', value: '2.5%', prev: '2.6%', impact: 'BEAT', time: '4d ago' }
      ]
    },
    CAD: {
      name: 'Canada',
      rate: 4.50,
      inflation: 2.7,
      leadingIndicators: {
        ppi: { value: 2.4, change: 0.0, direction: 'stable' },
        economicSentiment: { value: 82.1, change: 0.8, direction: 'up' },
        retailSales: { value: -1.2, change: -0.3, direction: 'down' },
        labourMarketIndex: { value: 59.5, change: -1.8, direction: 'down' }
      },
      themes: [
        { name: 'INFLATION', value: 2.7, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.3, sentiment: 'falling' },
        { name: 'LABOUR', value: 6.0, sentiment: 'falling' },
        { name: 'POLICY', value: 'Cut - Hard', sentiment: 'cut' }
      ],
      macroData: {
        unemployment: 6.0,
        wageGrowth: 3.8,
        ppi_yoy: 2.4,
        ppi_mom: 0.0,
        employmentChange: -40000,
        manufacturingPmi: 47.3,
        servicesPmi: 50.8,
        retailSales: -1.2,
        industrialProduction: -0.6,
        gdpGrowth: 0.1,
        cpi_yoy: 2.7,
        cpi_mom: 0.2,
        cpi_3m: 2.4,
        coreInflation: 2.2
      },
      recentReleases: [
        { event: 'Unemployment Rate', value: '6.0%', prev: '5.9%', impact: 'MISS', time: '3h ago' },
        { event: 'Employment Change', value: '-40K', prev: '+85K', impact: 'MISS', time: '3h ago' },
        { event: 'Retail Sales', value: '-1.2%', prev: '-0.8%', impact: 'MISS', time: '1d ago' }
      ]
    },
    AUD: {
      name: 'Australia',
      rate: 3.60,
      inflation: 3.5,
      leadingIndicators: {
        ppi: { value: 2.8, change: 0.1, direction: 'up' },
        economicSentiment: { value: 84.2, change: 1.5, direction: 'up' },
        retailSales: { value: 0.8, change: 0.2, direction: 'up' },
        labourMarketIndex: { value: 66.3, change: 0.3, direction: 'up' }
      },
      themes: [
        { name: 'INFLATION', value: 3.5, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.4, sentiment: 'rising' },
        { name: 'LABOUR', value: 3.8, sentiment: 'stable' },
        { name: 'POLICY', value: 'Hold - Hike', sentiment: 'hike' }
      ],
      macroData: {
        unemployment: 3.8,
        wageGrowth: 4.2,
        ppi_yoy: 2.8,
        ppi_mom: 0.1,
        manufacturingPmi: 49.8,
        servicesPmi: 52.5,
        retailSales: 0.8,
        industrialProduction: 0.3,
        gdpGrowth: 0.2,
        cpi_yoy: 3.5,
        cpi_mom: 0.1,
        cpi_3m: 3.2,
        coreInflation: 2.9
      },
      recentReleases: [
        { event: 'Unemployment Rate', value: '3.8%', prev: '3.9%', impact: 'BEAT', time: '6h ago' },
        { event: 'Wage Growth', value: '4.2%', prev: '4.0%', impact: 'BEAT', time: '1d ago' },
        { event: 'Retail Sales', value: '0.8%', prev: '0.5%', impact: 'BEAT', time: '2d ago' }
      ]
    },
    NZD: {
      name: 'New Zealand',
      rate: 4.25,
      inflation: 3.1,
      leadingIndicators: {
        ppi: { value: 2.3, change: -0.1, direction: 'down' },
        economicSentiment: { value: 80.5, change: 0.9, direction: 'up' },
        retailSales: { value: -0.3, change: 0.1, direction: 'down' },
        labourMarketIndex: { value: 61.8, change: -0.6, direction: 'down' }
      },
      themes: [
        { name: 'INFLATION', value: 3.1, sentiment: 'stable' },
        { name: 'GROWTH', value: 0.2, sentiment: 'falling' },
        { name: 'LABOUR', value: 3.6, sentiment: 'stable' },
        { name: 'POLICY', value: 'Hike - High', sentiment: 'hike' }
      ],
      macroData: {
        unemployment: 3.6,
        wageGrowth: 3.5,
        ppi_yoy: 2.3,
        ppi_mom: -0.1,
        manufacturingPmi: 50.5,
        servicesPmi: 51.8,
        retailSales: -0.3,
        industrialProduction: -0.2,
        gdpGrowth: 0.1,
        cpi_yoy: 3.1,
        cpi_mom: 0.0,
        cpi_3m: 2.8,
        coreInflation: 2.6
      },
      recentReleases: [
        { event: 'Unemployment Rate', value: '3.6%', prev: '3.7%', impact: 'BEAT', time: '1d ago' },
        { event: 'Wage Growth', value: '3.5%', prev: '3.4%', impact: 'BEAT', time: '1d ago' },
        { event: 'CPI Release', value: '3.1%', prev: '3.3%', impact: 'BEAT', time: '2d ago' }
      ]
    },
    CHF: {
      name: 'Switzerland',
      rate: 1.50,
      inflation: 1.4,
      leadingIndicators: {
        ppi: { value: 0.8, change: 0.0, direction: 'stable' },
        economicSentiment: { value: 76.3, change: -0.5, direction: 'down' },
        retailSales: { value: 0.1, change: 0.0, direction: 'stable' },
        labourMarketIndex: { value: 58.2, change: -0.3, direction: 'down' }
      },
      themes: [
        { name: 'INFLATION', value: 1.4, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.0, sentiment: 'stable' },
        { name: 'LABOUR', value: 2.1, sentiment: 'stable' },
        { name: 'POLICY', value: '1.50%', sentiment: 'neutral' }
      ],
      macroData: {
        unemployment: 2.1,
        wageGrowth: 2.8,
        ppi_yoy: 0.8,
        ppi_mom: 0.0,
        manufacturingPmi: 48.9,
        servicesPmi: 50.2,
        retailSales: 0.1,
        industrialProduction: -0.3,
        gdpGrowth: 0.0,
        cpi_yoy: 1.4,
        cpi_mom: 0.0,
        cpi_3m: 1.2,
        coreInflation: 1.1
      },
      recentReleases: [
        { event: 'CPI Release', value: '1.4%', prev: '1.6%', impact: 'MISS', time: '3d ago' },
        { event: 'Unemployment Rate', value: '2.1%', prev: '2.2%', impact: 'BEAT', time: '4d ago' },
        { event: 'Manufacturing PMI', value: '48.9', prev: '49.5%', impact: 'MISS', time: '5d ago' }
      ]
    }
  },
  calendar: [
    { date: '2026-07-20', country: 'US', event: 'CPI Release', previous: 4.3, forecast: 4.2, actual: null, importance: 'High' },
    { date: '2026-07-22', country: 'US', event: 'NFP', previous: 195000, forecast: 185000, actual: null, importance: 'High' },
    { date: '2026-07-30', country: 'US', event: 'FOMC', previous: 3.50, forecast: 3.50, actual: null, importance: 'High' },
    { date: '2026-08-01', country: 'EUR', event: 'ECB', previous: 2.25, forecast: 2.50, actual: null, importance: 'High' },
    { date: '2026-07-30', country: 'UK', event: 'BoE', previous: 3.75, forecast: 3.75, actual: null, importance: 'High' }
  ],
  news: [
    { title: 'Fed Signals Pause in Rate Hikes', source: 'Reuters', category: 'Fed', impact: 'High', published: new Date().toISOString(), summary: 'New Fed Chair hints at end of tightening cycle' },
    { title: 'ECB Hikes 25bps; More to Come', source: 'Bloomberg', category: 'ECB', impact: 'High', published: new Date().toISOString(), summary: 'ECB raises to 2.25%, expects additional hikes' },
    { title: 'USD/JPY Near 160 Intervention Level', source: 'FT', category: 'FX', impact: 'High', published: new Date().toISOString(), summary: 'Yen weakness escalates; MoF intervention risk rises' }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.url.startsWith('/api/currency/')) {
    const currency = req.url.split('/')[3].toUpperCase();
    res.writeHead(200);
    res.end(JSON.stringify(data.g10Data[currency] || { error: 'Not found' }));
  } else if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'G10 Macro Dashboard API' }));
  }
});

server.listen(PORT, () => {
  console.log('G10 Macro Dashboard API running on port ' + PORT);
});
