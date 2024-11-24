const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Claves secretas para firmar los tokens
const JWT_SECRET = '326006';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'tu_refresh_secreto';

// Registrar nuevo usuario
exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const newUser = new User({ username, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: 'Login exitoso', accessToken, refreshToken });
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Validaciones para el login
exports.validateLogin = [
  check('username')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre de usuario es obligatorio'),
  check('password')
    .trim()
    .escape()
    .notEmpty().withMessage('La contraseña es obligatoria'),
];

// Renovación de token de acceso
exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: 'Token requerido' });

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Refresh token no válido' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error al renovar el token:', error);
    res.status(403).json({ message: 'Refresh token inválido o expirado' });
  }
};
