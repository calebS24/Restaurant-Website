const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

async function resolveUserByToken(decoded) {
  if (decoded.accountType === 'admin') {
    const admin = await Admin.findById(decoded.sub);
    if (admin) return { user: admin, accountType: 'admin' };
  }
  if (decoded.accountType === 'customer') {
    const customer = await Customer.findById(decoded.sub);
    if (customer) return { user: customer, accountType: 'customer' };
  }

  // Backward compatibility for older tokens without accountType.
  const admin = await Admin.findById(decoded.sub);
  if (admin) return { user: admin, accountType: 'admin' };
  const customer = await Customer.findById(decoded.sub);
  if (customer) return { user: customer, accountType: 'customer' };
  return { user: null, accountType: '' };
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user, accountType } = await resolveUserByToken(decoded);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    req.accountType = accountType;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

function requireAnyRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, requireAnyRole };
