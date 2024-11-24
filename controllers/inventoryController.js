// controllers/inventoryController.js 
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');
const InventoryLog = require('../models/InventoryLog'); // Importa el modelo de historial
const { io } = require('../app'); // Importa io desde app.js para emitir notificaciones

// Verificar inventario bajo después de cada actualización
async function checkLowInventory(inventory) {
  if (inventory.quantity < inventory.minQuantity) {
    await Notification.create({
      message: `Inventario bajo para el ítem ${inventory.item} en ${inventory.location}`,
      type: 'inventory',
      inventoryId: inventory._id,
    });
    emitLowInventoryNotification(io, inventory); // Emite la notificación en tiempo real
  }
}

// Emite una notificación de inventario bajo
function emitLowInventoryNotification(io, inventoryItem) {
  io.emit('notification', {
    message: `Inventario bajo: ${inventoryItem.item} en ${inventoryItem.location}`,
    type: 'inventory',
    itemId: inventoryItem._id,
  });
}

// Registrar cambio de inventario en el historial
async function logInventoryChange(inventory, changeReason = 'Actualización del inventario') {
  await InventoryLog.create({
    inventoryId: inventory._id,
    quantity: inventory.quantity,
    location: inventory.location,
    changeReason,
  });
}

// Obtener todos los inventarios con paginación
exports.getAllInventories = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const inventories = await Inventory.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Inventory.countDocuments();

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      results: inventories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener inventarios' });
  }
};

// Agregar un nuevo inventario
exports.addInventory = async (req, res) => {
  const { item, quantity, minQuantity, location, sensorId } = req.body;

  try {
    const newInventory = new Inventory({ item, quantity, minQuantity, location, sensorId });
    await newInventory.save();
    res.status(201).json(newInventory);

    // Registro del cambio en el historial
    await logInventoryChange(newInventory, 'Nuevo inventario agregado');
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar inventario' });
  }
};

// Actualizar un inventario existente
exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventario no encontrado' });
    }
    res.json(updatedInventory);

    // Registrar el cambio en el historial
    await logInventoryChange(updatedInventory, 'Actualización de inventario');

    // Verificar si el inventario está bajo
    await checkLowInventory(updatedInventory);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar inventario' });
  }
};

// Actualizar inventario a través de datos del sensor
exports.updateFromSensor = async (req, res, next) => {
  const { sensorId, quantity } = req.body;

  try {
    const inventory = await Inventory.findOne({ sensorId });
    if (!inventory) {
      return res.status(404).send('Inventario no encontrado para el sensor especificado');
    }

    // Actualizamos la cantidad y verificamos si se necesita una notificación de inventario bajo
    inventory.quantity = quantity;
    await inventory.save();

    // Registrar el cambio en el historial
    await logInventoryChange(inventory, 'Actualización desde sensor');

    // Verificar si el inventario está bajo
    await checkLowInventory(inventory);

    res.json(inventory);
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores
  }
};
