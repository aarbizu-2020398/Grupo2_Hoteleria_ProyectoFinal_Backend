import Event from '../events/event.model.js';
import Room from '../rooms/room.model.js';

export const getHotelStatistics = async (req, res) => {
    try {
        const stats = await Event.aggregate([
            {
                $match: { status: "Confirmed" }
            },
            {
                $lookup: {
                    from: "lounges",
                    localField: "lounge",
                    foreignField: "_id",
                    as: "loungeData"
                }
            },
            { $unwind: "$loungeData" },
            {
                $lookup: {
                    from: "hotels",
                    localField: "loungeData.hotel",
                    foreignField: "_id",
                    as: "hotelData"
                }
            },
            { $unwind: "$hotelData" },
            {
                $group: {
                    _id: "$hotelData._id",
                    name: { $first: "$hotelData.name" },
                    count: { $sum: 1 },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ["$durationHours", "$loungeData.pricePerHour"] 
                        } 
                    }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Estadísticas de habitaciones más reservadas
export const getRoomStatistics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const matchStage = { status: "Confirmed" };
        if (startDate && endDate) {
            matchStage.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const stats = await Event.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "rooms",
                    localField: "room",
                    foreignField: "_id",
                    as: "roomData"
                }
            },
            { $unwind: "$roomData" },
            {
                $group: {
                    _id: "$roomData._id",
                    roomNumber: { $first: "$roomData.roomNumber" },
                    type: { $first: "$roomData.type" },
                    hotel: { $first: "$roomData.hotel" },
                    count: { $sum: 1 },
                    totalNights: { $sum: "$durationNights" },
                    totalRevenue: { $sum: "$pricing.total" }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Poblar nombre del hotel
        await Room.populate(stats, { path: "hotel", select: "name" });

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};