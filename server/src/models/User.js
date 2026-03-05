const mongoose = require('mongoose');
const { ROLES, STAFF_ROLES } = require('../config/roles');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    sex: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: [ROLES.CUSTOMER, ...STAFF_ROLES], default: ROLES.CUSTOMER },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
