const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantity: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  location: String,
  changeReason: String,
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
