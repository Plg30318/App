const { validationResult } = require('express-validator');
const Machine = require('../models/Machine');

let io;

// Configurar el objeto `io`
const setSocketIo = (socketIo) => {
    io = socketIo;
};

// Función para generar valores simulados de sensores
const simulateSensorValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Función para actualizar los valores de los sensores de una máquina simulada
const simulateMachineData = async () => {
    try {
        const machines = await Machine.find();

        for (const machine of machines) {
            // Actualizar los valores de cada sensor en la máquina
            machine.sensors = machine.sensors.map(sensor => ({
                ...sensor,
                value: simulateSensorValue(sensor.min, sensor.max)
            }));

            // Guardar la máquina actualizada en la base de datos
            await machine.save();

            // Emitir datos actualizados a través de Socket.IO si está configurado
            if (io) {
                io.emit('machineDataUpdate', { machineId: machine._id, sensors: machine.sensors });
            }
        }
    } catch (error) {
        console.error("Error al simular los datos de los sensores:", error);
    }
};

// Configurar la simulación para ejecutarse periódicamente
setInterval(simulateMachineData, 5000); // Cada 5 segundos

// Obtener todas las máquinas con paginación
const getAllMachines = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const machines = await Machine.find().skip(skip).limit(limit);
        const totalMachines = await Machine.countDocuments();

        res.json({
            total: totalMachines,
            page,
            pages: Math.ceil(totalMachines / limit),
            results: machines,
        });
    } catch (err) {
        next(err);
    }
};

// Agregar una nueva máquina
const addMachine = async (req, res, next) => {
    console.log("Solicitud de creación de máquina recibida:", req.body); // Confirmar solicitud
    const { name, location, sensors } = req.body;
    const newMachine = new Machine({
        name,
        location,
        sensors,
        status: 'Operativa',
    });

    try {
        const savedMachine = await newMachine.save();
        console.log("Datos recibidos en el backend:", req.body); // Debug
        res.status(201).json(savedMachine);

        // Emitir notificación a través de Socket.IO si está configurado
        if (io) {
            io.emit('machineAdded', savedMachine);
        }
    } catch (error) {
        console.error("Error al guardar la máquina:", error);
        res.status(500).json({ message: 'Error al guardar la máquina.' });
    }
};

// Eliminar una máquina por ID
const deleteMachine = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedMachine = await Machine.findByIdAndDelete(id);
        if (!deletedMachine) {
            return res.status(404).json({ message: 'Máquina no encontrada' });
        }
        res.json({ message: 'Máquina eliminada correctamente' });

        // Emitir notificación a través de Socket.IO si está configurado
        if (io) {
            io.emit('machineDeleted', { id });
        }
        console.log("Máquina eliminada correctamente con ID:", id);
    } catch (err) {
        console.error("Error al eliminar la máquina:", err);
        next(err);
    }
};

// Exportar todas las funciones de forma individual
module.exports = {
    setSocketIo,
    getAllMachines,
    addMachine,
    deleteMachine,
};

// Actualizar una máquina por ID
const updateMachine = async (req, res) => {
    const { id } = req.params;
    const { name, location, sensors } = req.body;

    try {
        const updatedMachine = await Machine.findByIdAndUpdate(
            id,
            { name, location, sensors },
            { new: true } // Devuelve la máquina actualizada
        );

        if (!updatedMachine) {
            return res.status(404).json({ message: 'Máquina no encontrada' });
        }

        res.json(updatedMachine);
    } catch (error) {
        console.error("Error al actualizar la máquina:", error);
        res.status(500).json({ message: 'Error al actualizar la máquina.' });
    }
};

// Exportar la función
module.exports = {
    updateMachine,
    // Otras funciones aquí...
};
