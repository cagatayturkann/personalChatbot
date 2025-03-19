const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// MongoDB bağlantısı
const connectDB = require('./config/db');

// Routes
const routes = require('./routes');

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Geliştirme ortamı kontrolü
const isDevelopment = process.env.NODE_ENV !== 'production';

// İzin verilen domainler
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500', // VS Code Live Server
  'http://127.0.0.1:5500', // VS Code Live Server
  'https://cagatayturkan.com',
  'https://www.cagatayturkan.com',
  'https://cagatayturkann.github.io',
  'https://personal-chatbot-nine.vercel.app',
];

// CORS ayarları
app.use(
  cors({
    origin: function (origin, callback) {
      // Geliştirme ortamında veya origin yoksa izin ver
      if (isDevelopment || !origin) {
        callback(null, true);
      }
      // İzin verilen originler listesindeyse izin ver
      else if (allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation: Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Origin/Referrer kontrolü middleware'i
app.use((req, res, next) => {
  // Geliştirme ortamında kontrolü atla
  if (isDevelopment) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // API istekleri için origin kontrolü
  if (req.path.startsWith('/api/')) {
    // Origin yoksa ve referer yoksa (doğrudan API çağrısı)
    if (!origin && !referer) {
      return res.status(403).json({ error: 'Unauthorized: Direct API access not allowed' });
    }

    // Origin veya referer'ın izin verilen domainlerden olup olmadığını kontrol et
    let isAllowed = false;

    if (origin) {
      isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));
    }

    if (!isAllowed && referer) {
      isAllowed = allowedOrigins.some((allowed) => referer.startsWith(allowed));
    }

    if (!isAllowed) {
      return res.status(403).json({ error: 'Unauthorized: Domain not allowed' });
    }
  }

  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use(routes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
