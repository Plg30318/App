const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// Obtener todas las máquinas
router.get('/', async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json({ results: machines });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las máquinas.' });
    }
});

// Crear una nueva máquina
router.post('/', async (req, res) => {
    const { name, location, sensors } = req.body;

    const newMachine = new Machine({ name, location, sensors, status: 'Operativa' });

    try {
        const savedMachine = await newMachine.save();
        res.status(201).json(savedMachine);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la máquina.' });
    }
});

// Actualizar una máquina
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location, sensors } = req.body;

    try {
        const updatedMachine = await Machine.findByIdAndUpdate(
            id,
            { name, location, sensors },
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedMachine) {
            return res.status(404).json({ message: 'Máquina no encontrada.' });
        }

        res.json(updatedMachine);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la máquina.' });
    }
});

// Eliminar una máquina
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedMachine = await Machine.findByIdAndDelete(id);
        if (!deletedMachine) {
            return res.status(404).json({ message: 'Máquina no encontrada.' });
        }
        res.json({ message: 'Máquina eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la máquina.' });
    }
});

module.exports = router;

router.post('/', async (req, res) => {
    const { name, location, sensors } = req.body;

    const newMachine = new Machine({
        name,
        location,
        sensors, // Sensores enviados desde el cliente
        status: 'Operativa',
    });

    try {
        const savedMachine = await newMachine.save();
        res.status(201).json(savedMachine);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar la máquina.' });
    }
});
