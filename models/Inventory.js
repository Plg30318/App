// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  minQuantity: { type: Number, default: 10 }, // cantidad mínima antes de emitir alerta
  location: { type: String }, // lugar o máquina donde se almacena
  sensorId: { type: String }, // ID de sensor para conexión
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventory', inventorySchema);
