const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const Event = require('../models/Event');

exports.getHotelStats = async (req, res) => {
    try {
        const { hotelId, startDate, endDate } = req.query;
        

        if (req.user.role === 'hotel_admin') {
            const hotel = await Hotel.findById(hotelId);
            if (!hotel || hotel.adminUser.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'No autorizado para ver estas estadísticas' });
            }
        }


        const reservationStats = await Reservation.aggregate([
            {
                $match: {
                    hotel: hotelId,
                    checkInDate: { $gte: new Date(startDate) },
                    checkOutDate: { $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);


        const roomStats = await Room.aggregate([
            {
                $match: { hotel: hotelId }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);


        const eventStats = await Event.aggregate([
            {
                $match: {
                    hotel: hotelId,
                    startDate: { $gte: new Date(startDate) },
                    endDate: { $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$price' }
                }
            }
        ]);

        res.json({
            reservationStats,
            roomStats,
            eventStats,
            period: {
                startDate,
                endDate
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar estadísticas', error: error.message });
    }
};

exports.getPlatformStats = async (req, res) => {
    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado para ver estadísticas de la plataforma' });
        }

        const { startDate, endDate } = req.query;


        const generalStats = {
            totalHotels: await Hotel.countDocuments(),
            totalRooms: await Room.countDocuments(),
            totalReservations: await Reservation.countDocuments({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }),
            totalEvents: await Event.countDocuments({
                startDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            })
        };


        const revenueByHotel = await Reservation.aggregate([
            {
                $match: {
                    checkInDate: { $gte: new Date(startDate) },
                    checkOutDate: { $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: '$hotel',
                    totalRevenue: { $sum: '$totalPrice' },
                    reservationCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            }
        ]);

        const occupancyStats = await Room.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            generalStats,
            revenueByHotel,
            occupancyStats,
            period: {
                startDate,
                endDate
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar estadísticas de la plataforma', error: error.message });
    }
};

exports.generateReservationReport = async (req, res) => {
    try {
        const { hotelId, startDate, endDate, format } = req.query;

        const reservations = await Reservation.find({
            hotel: hotelId,
            checkInDate: { $gte: new Date(startDate) },
            checkOutDate: { $lte: new Date(endDate) }
        })
        .populate('user', 'username email')
        .populate('room', 'roomNumber type')
        .populate('hotel', 'name');


        const report = {
            metadata: {
                generatedAt: new Date(),
                hotel: reservations[0]?.hotel?.name || 'N/A',
                period: { startDate, endDate }
            },
            data: reservations.map(r => ({
                reservationId: r._id,
                guest: r.user.username,
                email: r.user.email,
                room: r.room.roomNumber,
                checkIn: r.checkInDate,
                checkOut: r.checkOutDate,
                status: r.status,
                totalPrice: r.totalPrice
            }))
        };

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error al generar reporte', error: error.message });
    }
};