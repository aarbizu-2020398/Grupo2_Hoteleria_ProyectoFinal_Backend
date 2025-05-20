import Role from './rolesModel.js';
import User from '../users/user.model.js';

// Crear un nuevo rol
export const createRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ role });
    if (existingRole) {
      return res.status(400).json({ message: 'El rol ya existe' });
    }

    const newRole = new Role({ role });
    await newRole.save();

    res.status(201).json({
      message: 'Rol creado exitosamente',
      newRole
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el rol',
      error: error.message
    });
  }
};

// Asignar rol a un usuario
export const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Asignar el rol al usuario
    user.role = role._id;
    await user.save();

    res.status(200).json({
      message: 'Rol asignado al usuario exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al asignar el rol',
      error: error.message
    });
  }
};

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: 'No se encontraron roles' });
    }

    res.status(200).json({
      success: true,
      roles
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener roles',
      error: error.message
    });
  }
};

// Middleware para verificar el rol del usuario en las rutas
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
};
