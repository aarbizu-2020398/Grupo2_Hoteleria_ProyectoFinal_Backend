const Event = require('../models/Event');
const Hotel = require('../models/Hotel');

exports.createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            hotelId,
            startDate,
            endDate,
            capacity,
            type,
            resources,
            price
        } = req.body;


        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel no encontrado' });
        }

        if (req.user.role !== 'admin' && hotel.adminUser.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para crear eventos en este hotel' });
        }

        const event = new Event({
            title,
            description,
            hotel: hotelId,
            startDate,
            endDate,
            capacity,
            type,
            resources,
            price,
            createdBy: req.user.userId,
            status: 'scheduled'
        });

        await event.save();

        res.status(201).json({
            message: 'Evento creado exitosamente',
            event
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear evento', error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        let query = {};
        const { hotelId, startDate, endDate, type } = req.query;

        if (hotelId) query.hotel = hotelId;
        if (type) query.type = type;
        if (startDate && endDate) {
            query.startDate = { $gte: new Date(startDate) };
            query.endDate = { $lte: new Date(endDate) };
        }

        const events = await Event.find(query)
            .populate('hotel', 'name address')
            .populate('createdBy', 'username');

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('hotel', 'name address')
            .populate('createdBy', 'username');

        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener evento', error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updateData = req.body;

        const event = await Event.findById(eventId).populate('hotel');
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        if (req.user.role !== 'admin' && event.hotel.adminUser.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para actualizar este evento' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            updateData,
            { new: true }
        ).populate('hotel createdBy');

        res.json({
            message: 'Evento actualizado exitosamente',
            event: updatedEvent
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar evento', error: error.message });
    }
};

exports.cancelEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('hotel');
        
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }


        if (req.user.role !== 'admin' && event.hotel.adminUser.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'No autorizado para cancelar este evento' });
        }

        event.status = 'cancelled';
        await event.save();

        res.json({ 
            message: 'Evento cancelado exitosamente',
            event
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar evento', error: error.message });
    }
};