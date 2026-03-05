const mongoose = require('mongoose');
const { ROLES } = require('../config/roles');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: [ROLES.CUSTOMER], default: ROLES.CUSTOMER },
  },
  { timestamps: true, collection: 'customer' }
);

module.exports = mongoose.model('Customer', customerSchema);
