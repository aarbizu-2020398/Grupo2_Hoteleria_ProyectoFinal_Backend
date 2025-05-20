import Reservation from "../reservations/reservation.model.js";
import Hotel from "../hotels/hotel.model.js";
import Room from "../rooms/room.model.js";
import Event from "../events/event.model.js";

// Obtener estadísticas del hotel
export const getHotelStats = async (req, res) => {
  try {
    const { hotelId, startDate, endDate } = req.query;

    if (!hotelId || !startDate || !endDate) {
      return res.status(400).json({ message: "Faltan parámetros obligatorios" });
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
      { $match: { hotel: hotelId } },
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

    return res.json({
      reservationStats,
      roomStats,
      eventStats,
      period: { startDate, endDate }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al generar estadísticas del hotel', error: error.message });
  }
};

// Obtener estadísticas de la plataforma (solo para admin)
export const getPlatformStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para ver estadísticas de la plataforma' });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Faltan parámetros obligatorios" });
    }

    const generalStats = {
      totalHotels: await Hotel.countDocuments(),
      totalRooms: await Room.countDocuments(),
      totalReservations: await Reservation.countDocuments({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }),
      totalEvents: await Event.countDocuments({
        startDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
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

    return res.json({
      generalStats,
      revenueByHotel,
      occupancyStats,
      period: { startDate, endDate }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al generar estadísticas de la plataforma', error: error.message });
  }
};

// Generar reporte de reservaciones
export const generateReservationReport = async (req, res) => {
  try {
    const { hotelId, startDate, endDate } = req.query;

    if (!hotelId || !startDate || !endDate) {
      return res.status(400).json({ message: "Faltan parámetros obligatorios" });
    }

    const reservations = await Reservation.find({
      hotel: hotelId,
      checkInDate: { $gte: new Date(startDate) },
      checkOutDate: { $lte: new Date(endDate) }
    })
      .populate('user', 'username email')
      .populate('room', 'roomNumber type')
      .populate('hotel', 'nameHotel');

    const report = {
      metadata: {
        generatedAt: new Date(),
        hotel: reservations[0]?.hotel?.nameHotel || 'N/A',
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

    return res.json(report);
  } catch (error) {
    return res.status(500).json({ message: 'Error al generar reporte de reservas', error: error.message });
  }
};
