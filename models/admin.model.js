// admin-user.schema.js or admin-user.schema.ts

const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures only one user per email
    lowercase: true,
    trim: true,
  },
  password: { // Stores the securely HASHED password
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin'], // Example roles
    default: 'admin'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);