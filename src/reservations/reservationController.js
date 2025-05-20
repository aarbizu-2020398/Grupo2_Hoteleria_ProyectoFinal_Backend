import Reservation from './reservation.model.js';
import Hotel from "../hotels/hotel.model.js";  // Asegúrate de que esta ruta sea correcta
import Room from "../rooms/room.model.js";
import User from "../users/user.model.js";

// Crear reservación
export const createReservation = async (req, res) => {
    try {
        const data = req.body;

        // Verificar si el usuario y la habitación existen
        const userFound = await User.findOne({ _id: data.user });
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        const roomFound = await Room.findOne({ roomNumber: data.room });
        if (!roomFound) return res.status(404).json({ message: "Habitación no encontrada" });

        // Verificar disponibilidad de la habitación
        const isRoomAvailable = roomFound.availability.some(date =>
            new Date(date.date).toLocaleDateString() === new Date(data.checkInDate).toLocaleDateString() ||
            new Date(date.date).toLocaleDateString() === new Date(data.checkOutDate).toLocaleDateString()
        );

        if (!isRoomAvailable) {
            return res.status(400).json({ message: "La habitación no está disponible para las fechas seleccionadas" });
        }

        // Crear la nueva reservación
        const newReservation = await Reservation.create({
            ...data,
            user: userFound,
            room: roomFound
        });

        return res.status(201).json({
            message: "Reservación creada exitosamente",
            newReservation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear la reservación",
            error: error.message
        });
    }
};

// Obtener todas las reservaciones confirmadas
export const getAllReservations = async (req, res) => {
    const query = { status: "Confirmed" };
    try {
        const reservationList = await Reservation.find(query)
            .populate("user", "username email")
            .populate("room", "roomNumber type")
            .populate("hotel", "nameHotel");

        return res.status(200).json({
            success: true,
            reservationList
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener las reservaciones",
            error: error.message
        });
    }
};

// Obtener una reservación por ID
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id)
            .populate("user", "username email")
            .populate("room", "roomNumber type")
            .populate("hotel", "nameHotel");

        if (!reservation) return res.status(404).json({ message: "Reservación no encontrada" });

        return res.status(200).json({
            success: true,
            reservation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener la reservación",
            error: error.message
        });
    }
};

// Actualizar una reservación
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkInDate, checkOutDate, guests, status } = req.body;

        // Actualizar la reservación
        const updatedReservation = await Reservation.findByIdAndUpdate(id, { checkInDate, checkOutDate, guests, status }, { new: true });

        if (!updatedReservation) return res.status(404).json({ message: "Reservación no encontrada" });

        return res.status(200).json({
            message: "Reservación actualizada con éxito",
            updatedReservation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar la reservación",
            error: error.message
        });
    }
};

// Cancelar una reservación
export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const canceledReservation = await Reservation.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true });

        if (!canceledReservation) return res.status(404).json({ message: "Reservación no encontrada" });

        return res.status(200).json({
            success: true,
            message: "Reservación cancelada con éxito",
            canceledReservation
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al cancelar la reservación",
            error: error.message
        });
    }
};
