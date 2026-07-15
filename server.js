const http = require('http');
const PORT = process.env.PORT || 5000;

const data = {
  rates: [
    { country: 'US', rate: 3.75 },
    { country: 'EUR', rate: 2.25 },
    { country: 'UK', rate: 3.75 },
    { country: 'Japan', rate: 1.00 }
  ],
  fxPairs: [
    { pair: 'EUR/USD', rate: 1.1683, change: 0.25 },
    { pair: 'GBP/USD', rate: 1.3400, change: 0.15 },
    { pair: 'USD/JPY', rate: 159.40, change: -0.30 }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/api/dashboard') {
    res.end(JSON.stringify(data));
  } else if (req.url === '/api/health') {
    res.end(JSON.stringify({ status: 'ok', time: new Date() }));
  } else {
    res.end(JSON.stringify({ message: 'Macro Dashboard API' }));
  }
});

server.listen(PORT, () => console.log(`Server on port ${PORT}`));
