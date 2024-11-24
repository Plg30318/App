// routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const { protect } = require('../middlewares/authMiddleware');

// Obtener todos los inventarios - acceso permitido para 'admin' y 'user'
router.get('/', protect(['admin', 'user']), async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    console.error("Error al obtener inventarios:", error);
    res.status(500).json({ message: 'Error al obtener inventarios' });
  }
});

// Agregar nuevo inventario - solo accesible por 'admin'
router.post('/', protect(['admin']), async (req, res) => {
  const { item, quantity, minQuantity, location, sensorId } = req.body;

  try {
    const newInventory = new Inventory({ item, quantity, minQuantity, location, sensorId });
    await newInventory.save();
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar inventario' });
  }
});

// Actualizar inventario - solo accesible por 'admin'
router.put('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventario no encontrado' });
    }
    res.json(updatedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar inventario' });
  }
});

module.exports = router;
