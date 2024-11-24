const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Obtener todas las notificaciones no leídas
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
});

// Marcar notificación como leída
router.put('/:id/read', async (req, res) => {
  const io = req.app.get('io'); // Get io instance
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);
    io.emit('notification-read', notification); // Emit notification read event
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la notificación' });
  }
});

// Ruta de diagnóstico para obtener un número limitado de notificaciones
router.get('/all', async (req, res) => {
  try {
    const notifications = await Notification.find().limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las notificaciones', error });
  }
});

module.exports = router;
