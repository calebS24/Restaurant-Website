const mongoose = require('mongoose');

function ensureDbReady(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected. Please verify Mongo credentials and IP allowlist in Atlas.',
    });
  }
  return next();
}

module.exports = { ensureDbReady };
