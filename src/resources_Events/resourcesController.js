import Services from "./servicesModel.js"
import Resources from "./resourcesModel.js"


export const addServices = async(req,res) =>{
    try {
        
        const data = req.body

        const newServices = await Services.create({
            ...data
        })

        return res.status(200).json({
            msg: "Servicio añadido exitosamente!",
            newServices
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al añadir los servicios",
            error: err.message
        })
    }
}

export const addResources = async(req, res) =>{
    try {
        
        const data = req.body

        const newResource = await Resources.create({
            ...data
        })

        return res.status(200).json({
            msg: "Recursos añadidos con exito!",
            newResource
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al añadir recursos",
            error: err.message
        })
    }
}

export const editServices = async(req, res) =>{
    try {

        const data = req.body
        const {id} = req.params

        const foundedService = await Services.findByIdAndUpdate(id, data, {new: true})

        return res.status(200).json({
            msg: "Servicio editado con exito!",
            foundedService
        })
        
    } catch (err) {
        return res.status(500).json({
            msg: "Error al editar el servicio seleccionado",
            error: err.message
        })
    }
}

export const editResources = async(req, res) =>{
    try {
        
        const {id} = req.params
        const data = req.body

        const editedResource = await Resources.findByIdAndUpdate(id, data, {new: true})

        return res.status(200).json({
            msg: "Recurso editado con exito!",
            editedResource
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al intentar editar el recurso seleccionado",
            error: err.message
        })
    }
}

export const deleteResources = async(req, res) =>{
    try {
        
        const {id} = req.params

        const deletedResource = await Resources.deleteOne({_id: id})

        return res.status(200).json({
            msg: "Recurso eliminado con exito!",
            deletedResource
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al intentar borrar el Recurso",
            error: err.message
        })
    }
}

export const deleteServices = async(req, res) =>{
    try {
        
        const {id} = req.params

        const deletedResource = await Services.deleteOne({_id: id})

        return res.status(200).json({
            msg: "Servicio eliminado con exito!",
            deletedResource
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al intentar borrar el Servicio",
            error: err.message
        })
    }
}