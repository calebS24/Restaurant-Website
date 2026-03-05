const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map();

function getKey(req) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown-ip';
  const email = String(req.body?.email || '').toLowerCase().trim();
  return `${ip}|${email}`;
}

function loginRateLimit(req, res, next) {
  const now = Date.now();
  const key = getKey(req);
  const state = attempts.get(key);

  if (!state || now > state.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return next();
  }

  if (state.count >= MAX_ATTEMPTS) {
    const seconds = Math.ceil((state.resetAt - now) / 1000);
    return res.status(429).json({ error: `Too many login attempts. Try again in ${seconds}s.` });
  }

  state.count += 1;
  attempts.set(key, state);
  return next();
}

module.exports = { loginRateLimit };
