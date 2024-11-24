const io = require('socket.io-client');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado al servidor Socket.IO');
});

socket.on('notification', (data) => {
  console.log('Notificación recibida:', data);
});

socket.on('disconnect', () => {
  console.log('Conexión cerrada');
});

socket.on('error', (error) => {
  console.error('Error en Socket.IO:', error);
});
