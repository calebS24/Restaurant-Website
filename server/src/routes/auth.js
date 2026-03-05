const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const { requireAuth } = require('../middleware/auth');
const { loginRateLimit } = require('../middleware/loginRateLimit');
const { ensureDbReady } = require('../middleware/ensureDbReady');
const { ROLES, isStaffRole } = require('../config/roles');
const { getBootstrapRole, isAdminEmail, signToken } = require('../utils/auth');

const router = express.Router();
router.use(ensureDbReady);

function toPublicUser(user, accountType) {
  return {
    id: user._id.toString(),
    accountType,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    sex: user.sex || 'prefer_not_to_say',
    role: user.role,
  };
}

function validatePassword(password) {
  const p = String(password || '');
  if (p.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(p)) return 'Password must include at least one uppercase letter';
  if (!/[a-z]/.test(p)) return 'Password must include at least one lowercase letter';
  if (!/[0-9]/.test(p)) return 'Password must include at least one number';
  return '';
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, sex } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const normalizedEmail = String(email).toLowerCase().trim();
    if (isAdminEmail(normalizedEmail)) {
      return res.status(403).json({ error: 'This email is reserved for admin. Contact owner to create admin account.' });
    }
    const [adminExists, customerExists] = await Promise.all([
      Admin.findOne({ email: normalizedEmail }),
      Customer.findOne({ email: normalizedEmail }),
    ]);
    if (adminExists || customerExists) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const bootstrapRole = getBootstrapRole(normalizedEmail);
    const payload = {
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone || '').trim(),
      sex: ['male', 'female', 'other', 'prefer_not_to_say'].includes(String(sex || '').trim())
        ? String(sex).trim()
        : 'prefer_not_to_say',
      passwordHash,
    };

    if (isStaffRole(bootstrapRole)) {
      const admin = await Admin.create({ ...payload, role: bootstrapRole });
      const token = signToken(admin, 'admin');
      return res.status(201).json({ token, user: toPublicUser(admin, 'admin') });
    }

    const customer = await Customer.create({ ...payload, role: ROLES.CUSTOMER });
    const token = signToken(customer, 'customer');
    return res.status(201).json({ token, user: toPublicUser(customer, 'customer') });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', loginRateLimit, async (req, res) => {
  try {
    const { email, password, adminMode } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (adminMode) {
      if (!isAdminEmail(normalizedEmail)) {
        return res.status(403).json({ error: 'Admin login is not allowed for this email' });
      }
      const admin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');
      if (!admin) return res.status(401).json({ error: 'Invalid admin credentials' });
      const ok = await bcrypt.compare(password, admin.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid admin credentials' });

      const bootstrapRole = getBootstrapRole(admin.email);
      if (isStaffRole(bootstrapRole) && admin.role !== bootstrapRole) {
        admin.role = bootstrapRole;
        await admin.save();
      }

      const token = signToken(admin, 'admin');
      return res.json({ token, user: toPublicUser(admin, 'admin') });
    }

    const customer = await Customer.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (customer) {
      const ok = await bcrypt.compare(password, customer.passwordHash);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const token = signToken(customer, 'customer');
      return res.json({ token, user: toPublicUser(customer, 'customer') });
    }

    const admin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
    const adminOk = await bcrypt.compare(password, admin.passwordHash);
    if (!adminOk) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(admin, 'admin');
    return res.json({ token, user: toPublicUser(admin, 'admin') });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to login' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: toPublicUser(req.user, req.accountType) });
});

module.exports = router;
