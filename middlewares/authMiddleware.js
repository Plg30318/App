// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = '326006'; // Asegúrate de usar la misma clave secreta que en authController.js

// Middleware para proteger rutas con roles
const protect = (roles = []) => async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    console.log("Acceso denegado: no se proporcionó token");
    return res.status(401).json({ message: 'Acceso denegado, no hay token proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Token decodificado:", decoded);

    // Verificar si el usuario tiene el rol requerido (deshabilitado temporalmente)
    if (roles.length > 0 && !roles.includes(req.user?.role)) {
      console.log("Usuario no tiene el rol adecuado:", req.user.role);
      return res.status(403).json({ message: 'No tienes los permisos necesarios' });
    }

    next(); // Pasamos al siguiente middleware o ruta
  } catch (error) {
    console.error("Error de validación de token:", error);
    res.status(400).json({ message: 'Token inválido' });
  }
};

module.exports = { protect };
