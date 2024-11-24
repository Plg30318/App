const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Tipo de sensor
    min: { type: Number, required: true }, // Valor mínimo del rango
    max: { type: Number, required: true }, // Valor máximo del rango
    value: { type: Number, default: null }, // Valor actual (simulado)
});

const machineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: false },
    status: { type: String, default: 'Operativa' },
    sensors: [sensorSchema], // Lista de sensores
});

module.exports = mongoose.model('Machine', machineSchema);
