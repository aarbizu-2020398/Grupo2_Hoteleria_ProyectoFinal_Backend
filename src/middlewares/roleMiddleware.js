

export const roleMiddleware = (roles) => {
    return (req, res, next) => {
      // Verifica que el rol del usuario esté presente en el array de roles permitido
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado, no tienes permisos para esta acción' });
      }
      next();
    };
  };
  