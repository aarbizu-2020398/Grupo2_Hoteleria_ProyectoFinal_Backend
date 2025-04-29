const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

exports.createReservation = async (req, res) => {
    try {
        const {
            roomId,
            checkInDate,
            checkOutDate,
            guestName,
            guestEmail,
            numberOfGuests,
            specialRequests
        } = req.body;


        const room = await Room.findById(roomId).populate('hotel');
        if (!room) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }


        const conflictingReservation = await Reservation.findOne({
            room: roomId,
            status: { $ne: 'cancelled' },
            $or: [
                {
                    checkInDate: { $lte: checkOutDate },
                    checkOutDate: { $gte: checkInDate }
                }
            ]
        });

        if (conflictingReservation) {
            return res.status(400).json({ message: 'La habitación no está disponible para las fechas seleccionadas' });
        }

        const reservation = new Reservation({
            user: req.user.userId,
            room: roomId,
            hotel: room.hotel._id,
            checkInDate,
            checkOutDate,
            guestName,
            guestEmail,
            numberOfGuests,
            specialRequests,
            status: 'confirmed',
            totalPrice: room.price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
        });

        await reservation.save();


        await Room.findByIdAndUpdate(roomId, { status: 'reserved' });

        res.status(201).json({
            message: 'Reservación creada exitosamente',
            reservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear reservación', error: error.message });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        let query = {};
        

        if (req.user.role === 'hotel_admin') {
            const hotels = await Hotel.find({ adminUser: req.user.userId });
            query.hotel = { $in: hotels.map(h => h._id) };
        }

        else if (req.user.role === 'user') {
            query.user = req.user.userId;
        }

        const reservations = await Reservation.find(query)
            .populate('room')
            .populate('hotel', 'name')
            .populate('user', 'username email');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reservaciones', error: error.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('room')
            .populate('hotel', 'name')
            .populate('user', 'username email');

        if (!reservation) {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }


        if (req.user.role === 'user' && reservation.user._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para ver esta reservación' });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reservación', error: error.message });
    }
};

exports.updateReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const updateData = req.body;

        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }


        if (req.user.role === 'user' && reservation.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para actualizar esta reservación' });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            updateData,
            { new: true }
        ).populate('room hotel user');

        res.json({
            message: 'Reservación actualizada exitosamente',
            reservation: updatedReservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar reservación', error: error.message });
    }
};

exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }


        if (req.user.role === 'user' && reservation.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para cancelar esta reservación' });
        }

        reservation.status = 'cancelled';
        await reservation.save();


        await Room.findByIdAndUpdate(reservation.room, { status: 'available' });

        res.json({ 
            message: 'Reservación cancelada exitosamente',
            reservation
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar reservación', error: error.message });
    }
};