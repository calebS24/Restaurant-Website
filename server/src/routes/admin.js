const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const { requireAuth, requireAnyRole } = require('../middleware/auth');
const { ensureDbReady } = require('../middleware/ensureDbReady');
const { STAFF_ROLES } = require('../config/roles');

const router = express.Router();
const ADMIN_PANEL_ROLES = STAFF_ROLES;
const SEX_OPTIONS = ['male', 'female', 'other', 'prefer_not_to_say'];

router.get('/health', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), (req, res) => {
  res.json({ ok: true, role: req.user.role, email: req.user.email });
});

router.get('/users', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), async (_req, res) => {
  const [admins, customers] = await Promise.all([
    Admin.find({}, 'name email phone sex role createdAt').sort({ createdAt: -1 }),
    Customer.find({}, 'name email phone sex role createdAt').sort({ createdAt: -1 }),
  ]);

  const users = [
    ...admins.map(u => ({
      id: u._id.toString(),
      accountType: 'admin',
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      sex: u.sex || 'prefer_not_to_say',
      role: u.role,
      createdAt: u.createdAt,
    })),
    ...customers.map(u => ({
      id: u._id.toString(),
      accountType: 'customer',
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      sex: u.sex || 'prefer_not_to_say',
      role: 'customer',
      createdAt: u.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    users,
    roles: ['customer', ...STAFF_ROLES],
  });
});

router.post('/users/admin', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), async (req, res) => {
  const { name, email, phone, password, role, sex } = req.body || {};
  const safeName = String(name || '').trim();
  const safeEmail = String(email || '').toLowerCase().trim();
  const safePhone = String(phone || '').trim();
  const safePassword = String(password || '');
  const safeSex = String(sex || 'prefer_not_to_say').trim();

  if (!safeName || !safeEmail || !safePassword || !role) {
    return res.status(400).json({ error: 'Name, email, password and role are required' });
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid team role' });
  }
  if (!SEX_OPTIONS.includes(safeSex)) {
    return res.status(400).json({ error: 'Invalid sex value' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (safePassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const [adminExists, customerExists] = await Promise.all([
    Admin.findOne({ email: safeEmail }).lean(),
    Customer.findOne({ email: safeEmail }).lean(),
  ]);
  if (adminExists || customerExists) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(safePassword, 10);
  const created = await Admin.create({
    name: safeName,
    email: safeEmail,
    phone: safePhone,
    sex: safeSex,
    passwordHash,
    role,
  });

  return res.status(201).json({
    ok: true,
    user: {
      id: created._id.toString(),
      accountType: 'admin',
      name: created.name,
      email: created.email,
      phone: created.phone || '',
      sex: created.sex || 'prefer_not_to_say',
      role: created.role,
    },
  });
});

router.patch('/users/:accountType/:id/role', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), async (req, res) => {
  const { role } = req.body || {};
  const { accountType, id } = req.params;
  const allowedRoles = ['customer', ...STAFF_ROLES];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (!['admin', 'customer'].includes(accountType)) {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  if (accountType === 'admin') {
    const admin = await Admin.findById(id).select('+passwordHash');
    if (!admin) return res.status(404).json({ error: 'User not found' });

    if (role === 'customer') {
      const existingCustomer = await Customer.findOne({ email: admin.email });
      if (existingCustomer) {
        return res.status(409).json({ error: 'Email already exists in customer collection' });
      }
      await Customer.create({
        name: admin.name,
        email: admin.email,
        phone: admin.phone || '',
        sex: admin.sex || 'prefer_not_to_say',
        passwordHash: admin.passwordHash,
        role: 'customer',
      });
      await Admin.deleteOne({ _id: admin._id });
      return res.json({ ok: true, user: { id, accountType: 'customer', role: 'customer' } });
    }

    admin.role = role;
    await admin.save();
    return res.json({ ok: true, user: { id: admin._id.toString(), accountType: 'admin', role: admin.role } });
  }

  const customer = await Customer.findById(id).select('+passwordHash');
  if (!customer) return res.status(404).json({ error: 'User not found' });

  if (role === 'customer') {
    return res.json({ ok: true, user: { id: customer._id.toString(), accountType: 'customer', role: 'customer' } });
  }

  const existingAdmin = await Admin.findOne({ email: customer.email });
  if (existingAdmin) {
    return res.status(409).json({ error: 'Email already exists in admin collection' });
  }
  const promoted = await Admin.create({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    sex: customer.sex || 'prefer_not_to_say',
    passwordHash: customer.passwordHash,
    role,
  });
  await Customer.deleteOne({ _id: customer._id });
  return res.json({ ok: true, user: { id: promoted._id.toString(), accountType: 'admin', role: promoted.role } });

});

router.patch('/users/:accountType/:id/profile', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), async (req, res) => {
  const { accountType, id } = req.params;
  if (!['admin', 'customer'].includes(accountType)) {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').toLowerCase().trim();
  const phone = String(req.body?.phone || '').trim();
  const sex = String(req.body?.sex || 'prefer_not_to_say').trim();

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!SEX_OPTIONS.includes(sex)) {
    return res.status(400).json({ error: 'Invalid sex value' });
  }

  const [adminConflict, customerConflict] = await Promise.all([
    Admin.findOne({ email, _id: { $ne: id } }).lean(),
    Customer.findOne({ email, _id: { $ne: id } }).lean(),
  ]);
  if (adminConflict || customerConflict) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const Model = accountType === 'admin' ? Admin : Customer;
  const user = await Model.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.sex = sex;
  await user.save();

  return res.json({
    ok: true,
    user: {
      id: user._id.toString(),
      accountType,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      sex: user.sex || 'prefer_not_to_say',
      role: user.role,
    },
  });
});

router.delete('/users/:accountType/:id', ensureDbReady, requireAuth, requireAnyRole(ADMIN_PANEL_ROLES), async (req, res) => {
  const { accountType, id } = req.params;
  if (!['admin', 'customer'].includes(accountType)) {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  const isSelf = req.accountType === accountType && String(req.user?._id || '') === String(id);
  if (isSelf) {
    return res.status(400).json({ error: 'You cannot remove your own account' });
  }

  if (accountType === 'admin') {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: 'User not found' });

    if (admin.role === 'owner') {
      const ownerCount = await Admin.countDocuments({ role: 'owner' });
      if (ownerCount <= 1) {
        return res.status(400).json({ error: 'Cannot remove the last owner account' });
      }
    }

    await Admin.deleteOne({ _id: id });
    return res.json({ ok: true });
  }

  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ error: 'User not found' });
  await Customer.deleteOne({ _id: id });
  return res.json({ ok: true });
});

module.exports = router;
