// src/reservations/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    req.user = decoded;  // Almacena la información del usuario en la solicitud
    next();  // Continúa con el siguiente middleware o ruta
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido', error: err.message });
  }
};
