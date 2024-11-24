const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const machineRoutes = require('./routes/machineRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use('/machines', machineRoutes);

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/machinesdb')
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));


// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
