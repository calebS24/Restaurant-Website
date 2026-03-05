const jwt = require('jsonwebtoken');
const { ROLES } = require('../config/roles');

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminEmail(email) {
  if (!email) return false;
  return getAdminEmails().includes(String(email).toLowerCase());
}

function getBootstrapRole(email) {
  return isAdminEmail(email) ? ROLES.OWNER : ROLES.CUSTOMER;
}

function signToken(user, accountType) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, accountType },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { isAdminEmail, getBootstrapRole, signToken };
