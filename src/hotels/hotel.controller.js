import Hotel from "./hotel.model.js";

export const registerHotel = async(req, res) =>{
    try {
        const {nameHotel, address, category, comfort } = req.body

        let pictureHotel = req.file ? req.file.filename : null

        const newHotel = await Hotel.create({
            nameHotel: nameHotel,
            address: address,
            category: category,
            comfort: comfort,
            media: pictureHotel
        })

        console.log(pictureHotel)
        return res.status(200).json({
            msg: "Hotel Registrado con exito!",
            newHotel
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al registrar el hotel",
            error: error.message
        })
    }
}

export const updateHotelData = async(req, res) => {
    try {
        
        const {id} = req.params
        const data = req.body

        const updateHotel = await Hotel.findByIdAndUpdate(id, data, {new: true})

        return res.status(200).json({
            success: true,
            msg: "Datos Actualizados con exito!",
            updateHotel
        })


    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar los datos",
            error: error.message
        })
    }
}

export const deteleHotelData = async(req, res) =>{
    try {
        const {id} = req.params

        await Hotel.findByIdAndUpdate(id, {status: false}, {new:true})

        return res.status(200).json({
            msg: "Hotel Eliminado con exito",
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al intentar eliminar los datos del hotel",
            error: error.message
        }) 
    }
}

export const findHotel = async(req, res) =>{
     try {
        const { nameHotel } = req.query;
        const query = {
            nameHotel: { $regex: nameHotel, $options: 'i' }
        };

        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query).sort({ nameHotel: 1 })
        ]);

        return res.status(200).json({
            succes: true,
            total,
            hotels
        });

    } catch (err) {
        return res.status(500).json({
            succes: false,
            error: err.message
        });
    }
}

export const listAllHotels = async(req, res) =>{
    try {
        const query = {status: true}
        const {desde = 0, limite = 30} = req.query
        
        const [total, hotels] = await Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query).skip(Number(desde)).limit(Number(limite))
        ])

        return res.status(202).json({
            msg: "Lista de Hoteles",
            total,
            hotels
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}