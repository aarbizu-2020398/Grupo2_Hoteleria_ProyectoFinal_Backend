import Lounge from "./loungeModel.js";
import Hotel from "../hotels/hotel.model.js";

export const registerLounge = async (req, res) => {
    try {
        const data = req.body
        const findHotel = await Hotel.findOne({nameHotel: data.hotel})
        
        let pictureLounge = req.file ? req.file.filename : null

        const newLounge = await Lounge.create({
            ...data,
            hotel: findHotel,
            media: pictureLounge
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

export const listLoungesByHotel = async (req, res) => {
    try {
        const { hotelName, desde = 0, limite = 50 } = req.query;
        const query = { status: true };

        const hotels = await Hotel.find({
            name: { $regex: hotelName, $options: 'i' },
            status: true
        }).select('_id');

        const hotelIds = hotels.map(hotel => hotel._id);
        
        const [total, lounges] = await Promise.all([
            Lounge.countDocuments({ ...query, hotel: { $in: hotelIds } }),
            Lounge.find({ ...query, hotel: { $in: hotelIds } })
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('hotel', 'name')
        ]);

        return res.status(200).json({
            success: true,
            msg: "Lounges encontrados con éxito!",
            total,
            lounges
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

export const deleteLounge = async(req, res) =>{
    try {
        
        const {id} = req.params

        await Lounge.findByIdAndUpdate(id, {status: false}, {new: true})

        return res.status(200).json({
            msg: "Salón eliminado con exito"
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}