import Reservation from "./reservation.model";
import Room from "../rooms/room.model";


export const createReservation = async (req, res) => {
    try {
        
        const data = req.body

        const userFound = req.user._id
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

        const userId = req.user._id; 
        const { desde = 0, limite = 50 } = req.query;

        const [total, reservations]  = await Promise.all([
            Reservation.countDocuments({host: userId, statusActive: true}),
            Reservation.find({host: userId, statusActive: true}).skip(Number(desde)).limit(Number(limite))
            .populate("name", "user")
            .populate("room.hotel", "nameHotel")
            .populate("user", "name email")
        ])

        return res.status(202).json({
            msg: "Reservaciones listadas exitosamente!",
            total,
            reservations
        })

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener reservación', 
            error: error.message 
        });
    }
};
/*
    export const listEventsByUser = async (req, res) => {
        try {
            const userId = req.user._id; 
            const { desde = 0, limite = 50 } = req.query;
    
            const [total, events] = await Promise.all([
                Event.countDocuments({ host: userId, status: "Confirmed" }),
                Event.find({ host: userId, status: "Confirmed" })
                    .skip(Number(desde))
                    .limit(Number(limite))
                    .populate('lounge', 'name pricePerHour')
                    .populate('resources.resource', 'nameResource type')
                    .populate('services.service', 'nameService price')
            ]);
    
            return res.status(200).json({
                success: true,
                total,
                events
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }
    };
*/

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