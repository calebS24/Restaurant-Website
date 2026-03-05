require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
let dbReady = false;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    db: dbReady ? 'connected' : 'disconnected',
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

function sanitizeMongoUri(uri) {
  if (!uri) return '';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

function logMongoHelp() {
  // eslint-disable-next-line no-console
  console.log('[Mongo] Check these:');
  // eslint-disable-next-line no-console
  console.log('1) Atlas Database Access username/password');
  // eslint-disable-next-line no-console
  console.log('2) Atlas Network Access includes your IP');
  // eslint-disable-next-line no-console
  console.log('3) MONGODB_URI in server/.env matches the Atlas user exactly');
}

async function connectMongoWithRetry() {
  const retryMs = 8000;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    dbReady = true;
    // eslint-disable-next-line no-console
    console.log('[Mongo] Connected');
  } catch (err) {
    dbReady = false;
    // eslint-disable-next-line no-console
    console.error('[Mongo] Connection failed:', err?.message || err);
    logMongoHelp();
    setTimeout(connectMongoWithRetry, retryMs);
  }
}

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  mongoose.connection.on('connected', () => {
    dbReady = true;
  });
  mongoose.connection.on('disconnected', () => {
    dbReady = false;
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`[Mongo] Using URI: ${sanitizeMongoUri(process.env.MONGODB_URI)}`);
    connectMongoWithRetry();
  });
}

startServer().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
