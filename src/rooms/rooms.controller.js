import Hotel from "../hotels/hotel.model.js";
import Room from "./room.model.js";


export const addRoom = async(req, res) =>{
    try {
        
        const data = req.body

        let pictureRoom = req.file ? req.file.filename : null

        const findHotel = await Hotel.findOne({nameHotel: data.hotel})

        const registRoom = await Room.create({
            ...data,
            hotel: findHotel,
            media: pictureRoom
        })

        return res.status(200).json({
            msg: "Cuarto añadido con exito!",
            registRoom
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            msg: "Error al Añadir el cuarto",
            error: err.message
        })
    }
}

export const updateRoom = async(req, res) =>{
    try {
        const {id} = req.params
        const {hotel, availability, ...data}  = req.body

        const findRoomEdit = await Room.findByIdAndUpdate(id, data, {new: true})

        return res.status(200).json({
            msg: "Actualización de datos realizada con exito!",
            findRoomEdit
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al actualizar los datos del cuarto",
            error: err.message
        })
    }
}

export const deleteRoom = async(req, res) =>{
    try {
        
        const {id} = req.params

        await Room.findByIdAndUpdate(id, {statusActive: false}, {new: true})

        return res.status(200).json({
            msg: "Cuarto eliminado con exito!"
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al intentar eliminar el cuarto",
            error: err.message
        })
    }
}

export const listRoomsByHotel = async(req, res) => {
    try {
        const { hotelName, desde = 0, limite = 50 } = req.query; 
        const query = { statusActive: true };

        const hotels = await Hotel.find({
            name: { $regex: hotelName, $options: 'i' },
            status: true
        }).select('_id');

        if (hotels.length === 0) {
            return res.status(404).json({
                success: false,
                msg: "No se encontraron hoteles con ese nombre"
            });
        }

        const hotelIds = hotels.map(hotel => hotel._id);
        
        const [total, rooms] = await Promise.all([
            Room.countDocuments({ ...query, hotel: { $in: hotelIds } }),
            Room.find({ ...query, hotel: { $in: hotelIds } })
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('hotel', 'name') 
        ]);

        return res.status(200).json({
            success: true,
            msg: "Habitaciones encontradas con éxito!",
            total,
            rooms
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const listAllRooms = async(req, res) =>{
    try {
        const query = {statusActive: true}
        const {desde = 0, limite = 30} = req.query
        
        const [total, rooms] = await Promise.all([
            Room.countDocuments(query),
            Room.find(query).skip(Number(desde)).limit(Number(limite))
        ])

        return res.status(202).json({
            msg: "Lista de Hoteles",
            total,
            rooms
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}