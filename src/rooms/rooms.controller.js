import Hotel from "../hotels/hotel.model";
import Room from "./room.model";


export const addRoom = async(req, res) =>{
    try {
        
        const data = req.body

        const findHotel = await Hotel.findOne({nameHotel: data.hotel})

        const registRoom = await Room.create({
            hotel: findHotel,
            roomNumber: data.roomNumber,
            floor: data.floor,
            capacity: data.capacity,
            type: data.type,
            description: data.description,
            priceNight: data.priceNight
        })

        return res.status(200).json({
            msg: "Cuarto añadido con exito!",
            registRoom
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al Añadir el cuarto",
            error: err.message
        })
    }
}

export const updateRoom = async(req, res) =>{
    try {
        const {id} = req.params
        const {hotel, description, ...data}  = req.body

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