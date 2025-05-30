import User from "./user.model.js";
import { hash, verify } from "argon2";

export const getUser = async (req, res) => {
    try {
        
        const { limit = 10, desde = 0 } = req.query;
        const query = { status: true, role: "USER"};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query).skip(Number(desde)).limit(Number(limit))
        ]);

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: 'Error al obtener usuarios',
            e
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                msg: "Debes proporcionar la contraseña para actualizar tu perfil",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                msg: "La contraseña es incorrecta",
            });
        }
        const updatedUser = await User.findByIdAndUpdate(id, { name, username }, { new: true });

        await user.save();

        return res.status(200).json({
            success: true,
            msg: "Perfil actualizado correctamente",
            user: {
                success: true,
                msg: "Perfil actualizado correctamente",
                user: updatedUser,
            },
        });
    } catch (error) {
        console.error("Error en updateUserProfile:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar el perfil",
            error: error.message,
        });
    }
};

export const updateCredentials = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, oldPassword } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        const validPassword = await verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                msg: "La contraseña actual es incorrecta",
            });
        }
        const hashedPassword = await hash(password);
        const updatedUser = await User.findByIdAndUpdate(id, { email, password: hashedPassword }, { new: true });

        await user.save();

        return res.status(200).json({
            success: true,
            msg: "Credenciales actualizadas correctamente",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error en updateUserCredentials:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar credenciales",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        await User.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({
            success: true,
            msg: "Usuario deshabilitado correctamente",
        });

    } catch (error) {
        console.error("Error en deleteUser:", error);
        return res.status(500).json({
            success: false,
            msg: "Error al deshabilitar usuario",
            error: error.message,
        });
    }
};

