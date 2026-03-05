const mongoose = require('mongoose');
const { STAFF_ROLES } = require('../config/roles');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    sex: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: STAFF_ROLES, required: true },
  },
  { timestamps: true, collection: 'admin' }
);

module.exports = mongoose.model('Admin', adminSchema);
