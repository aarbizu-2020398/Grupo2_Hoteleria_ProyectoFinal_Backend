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
        let {nameHotel, address, comfort, roomPrice, category, sort, startsWith} = req.params

        let filter = {}

        const isStartWith = startsWith === "true"

        if(nameHotel){
            filter.nameHotel ={
                $regex: isStartWith ? `${nameHotel}` : nameHotel, $Options: "i"
            }
        }

        if(address) filter.address = address
        if(comfort) filter.comfort = comfort
        if(roomPrice) filter.address = Number(roomPrice)
        if(category) filter.category = category

        let order = {}
        if(sort){
            order[sort] = sort === "asc" ? 1 : -1
        }

        if(sort === "asc") order.nameHotel = 1
        if(sort === "desc") order.nameHotel = -1

        const findHotel = await Hotel.find(filter).sort(order)

        return res.status(200).json({
            success: true,
            findHotel
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al intentar encontrar los hoteles",
            error: err.message
        })
    }
}