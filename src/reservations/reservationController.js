import Reservation from "./reservation.model";
import Room from "../rooms/room.model";
import User from "../users/user.model";


export const createReservation = async (req, res) => {
    try {
        
        const data = req.body

        const userFound = await User.findOne({name: data.user})
        const roomFound = await Room.findOne({roomNumber: data.room})

        const newReservation = await Reservation.create({
            ...data,
            user: userFound,
            room: roomFound
        })

        return res.status(201).json({
            message: 'Reservación creada exitosamente',
            newReservation
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al crear reservación', 
            error: error.message 
        });
    }
};

export const getAllReservations = async (req, res) => {
    const query = {status: "Confirmed"}
    try {

        const reservationList = await Reservation.find(query)

        return res.status(200).json({
            success: true,
            reservationList
        })
        
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener reservaciones', 
            error: error.message 
        });
    }
};

export const getReservationById = async (req, res) => {
    try {



    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener reservación', 
            error: error.message 
        });
    }
};

export const updateReservation = async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al actualizar reservación', 
            error: error.message 
        });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al cancelar reservación', 
            error: error.message 
        });
    }
};