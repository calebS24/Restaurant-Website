require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

function parseAllowedOrigins() {
  const raw = [process.env.FRONTEND_URL, process.env.FRONTEND_URLS]
    .filter(Boolean)
    .join(',');

  return raw
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

function isVercelPreviewOrigin(origin, rootDomain) {
  if (!origin || !rootDomain) return false;
  try {
    const host = new URL(origin).hostname;
    return host.endsWith(`.${rootDomain}`) || host === rootDomain;
  } catch (_err) {
    return false;
  }
}

const allowedOrigins = parseAllowedOrigins();
const vercelRootDomain = String(process.env.VERCEL_ROOT_DOMAIN || '').trim();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (isVercelPreviewOrigin(origin, vercelRootDomain)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

let connectPromise = null;

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2 && connectPromise) {
    await connectPromise;
    return;
  }

  connectPromise = mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .finally(() => {
      if (mongoose.connection.readyState !== 1) {
        connectPromise = null;
      }
    });

  await connectPromise;
}

module.exports = { app, connectMongo };
