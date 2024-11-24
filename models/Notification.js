// models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['inventory', 'maintenance'], required: true },
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  machineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' }, // Relación con Machine si aplica
});

module.exports = mongoose.model('Notification', notificationSchema);


