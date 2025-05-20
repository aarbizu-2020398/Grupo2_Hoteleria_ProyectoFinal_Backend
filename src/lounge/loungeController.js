import Lounge from "./loungeModel.js";
import Hotel from "../hotels/hotel.model.js";

export const registerLounge = async (req, res) => {
    try {
        const data = req.body
        const findHotel = await Hotel.findOne({nameHotel: data.hotel})

        const newLounge = await Lounge.create({
            ...data,
            hotel: findHotel
        })

        return res.status(200).json({
            msg: "Salon registrado con exito!",
            newLounge
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

export const editLounge = async(req, res) =>{
    try {
        
        const {id} = req.params
        const {name, description, pricePerHour, maxCapacity, statusActive, hotel} = req.body

        const findHotel = await Hotel.findOne({nameHotel: hotel})

        const editSalon = await Lounge.findOneAndUpdate(id, {name, description, pricePerHour, maxCapacity, statusActive, findHotel}, {new: true})

        return res.status(200).json({
            msg: "Salon editado con exito!",
            editSalon
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

export const listLounges = async (req, res) =>{
    try {
        
        const query = {status: true}

        const list = await Lounge.find(query)

        return res.status(200)

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}