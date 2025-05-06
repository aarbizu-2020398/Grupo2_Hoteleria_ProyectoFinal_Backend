import Hotel from "../hotels/hotel.model.js"
import Event from "./event.model.js"
import Resources from "../resources_Events/resourcesModel.js";
import Services from "../resources_Events/servicesModel.js";
import User from "../users/user.model.js";
import { generateFacture } from "../invoice/invoiceController.js";

export const createEvent = async (req, res) => {
    try {
        const data = req.body
        const {services = [], resources = []} = req.body

        const findHotel = await Hotel.findOne({ nameHotel: data.hotel })
        const findHost = await User.findOne({name: data.host})

        const recursosProcesados = await Promise.all(resources.map(async r => {
            const recurso = await Resources.findOne({ nameResource: r.resource })
            
            return {
                resource: recurso._id,
                nameResource: recurso.nameResource,
                quantity: r.quantity,
                timeUnit: r.timeUnit,
                priceSnapshot: recurso.price,
                total: recurso.price * r.quantity
            }
        }))

        const serviciosProcesados = await Promise.all(services.map(async s => {
            const servicio = await Services.findOne({ nameService: s.service })

            let precioTotal = 0;
            let timeUsed = s.timeUsed || 1

            if (servicio.unitType === "Hora" || servicio.unitType === "Dia") {
                if (servicio.unitType === "Dia" && s.timeUnit === "Hora") {
                    timeUsed = s.timeUsed / 24
                } else if (servicio.unitType === "Hora" && s.timeUnit === "Dia") {
                    timeUsed = s.timeUsed * 24
                }
                precioTotal = servicio.price * timeUsed * (s.quantity || 1);
            } else {
                precioTotal = servicio.price * (s.quantity || 1);
            }

            return {
                service: servicio._id,
                nameService: servicio.nameService,
                quantity: s.quantity,
                priceSnapshot: servicio.price,
                total: precioTotal
            }
        }))

        const subtotalRecursos = recursosProcesados.reduce((sum, r) => sum + r.total, 0);
        const subtotalServicios = serviciosProcesados.reduce((sum, s) => sum + s.total, 0);

        const newEvent = await Event.create({
            nameEvent: data.nameEvent,
            host: findHost,
            date: data.date,
            hotel: findHotel,
            resources: recursosProcesados,
            services: serviciosProcesados,
            pricing: {
                subtotalRecursos,
                subtotalServicios
            }
        })

        return res.status(200).json({
            msg: "Evento creado con exito!",
            newEvent
        })

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al crear evento', 
            error: error.message 
        });
    }
};

export const confirmEvent = async(req, res) =>{
    try {
        const {id} = req.params

        const eventUpdate = await Event.findByIdAndUpdate(id, {status: "Confirmed"}, {new: true}).populate("resources.resource services.service")        
        
        const facture = await generateFacture(eventUpdate);
        
        await Promise.all(eventUpdate.resources.map(async (r) => {
            const recurso = await Resources.findById(r.resource._id)
            
            const newStock = recurso.stock - r.quantity;
            await Resources.findByIdAndUpdate( recurso._id, { stock: newStock });
        }));

        return res.status(200).json({
            succes: true,
            facture
        })

    } catch (err) {
        return res.status(500).json({
            msg: "Error al confirmar el evento",
            error: err.message
        })
    }
}

export const cancelEvent = async(req, res) =>{
    try {
        const {id} = req.params

        const event = await Event.findById(id)

        await Promise.all(event.resources.map(async (r) => {
            const recurso = await Resources.findById(r.resource._id)
            const newStock = recurso.stock + r.quantity;
            await Resources.findByIdAndUpdate( recurso._id, { stock: newStock });
        }));

        const canceledEvent = await Event.findByIdAndUpdate(id, {status: "Cancelled"}, {new: true})
        
        return res.status(200).json({
            succes: true,
            msg: "Evento cancelado",
            canceledEvent
        })

    } catch (err) {
        return res.status(500).json({

        })
    }
}

export const getAllEvents = async (req, res) => {
    const query = {status: "Confirmed"}
    try {

    const events = await Event.find(query).populate('hotel', 'nameHotel address').populate('host','name email').select('date nameEvent hotel host').lean();

    const formattedEvents = events.map(event => ({
            eventName: event.nameEvent,
            date: event.date,
            hotel: { name: event.hotel?.nameHotel || "Hotel no encontrado", address: event.hotel?.address || "Dirección no disponible" },
            host: { name: event.host?.name || "Anfitrión no encontrado", email: event.host?.email || "Correo no disponible" },
        }));

        const total = await Event.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            events: formattedEvents
        })

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener eventos', 
            error: error.message 
        });
    }
};

export const getEventById = async (req, res) => {
    try {

        const {id} = req.params

        const event = await Event.findById(id).populate('hotel', 'nameHotel')
        .populate("resources.resource", "name type unitType")
        .populate("services.service", "name price description")
        return res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al obtener evento', 
            error: error.message
         });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const {id} = req.params
        const data = req.body
        const {services = [], resources = []} = req.body

        const findHotel = await Hotel.findOne({ nameHotel: data.hotel })
        const findHost = await User.findOne({name: data.host})

        const recursosProcesados = await Promise.all(resources.map(async r => {
            const recurso = await Resources.findOne({ nameResource: r.resource });

            let precioTotal = recurso.price;
            if (recurso.unitType === 'Hora' && r.timeUnit) {
                const horas = convertirATiempo(r.timeUnit)
                precioTotal = recurso.price * horas * r.quantity;
            } else {
                precioTotal = recurso.price * r.quantity;
            }

            return {
                resource: recurso._id,
                nameResource: recurso.nameResource,
                quantity: r.quantity,
                timeUnit: r.timeUnit,
                priceSnapshot: recurso.price,
                total: precioTotal
            }
        }))

        const serviciosProcesados = await Promise.all(services.map(async s => {
            const servicio = await Services.findOne({ nameService: s.service })

            return {
                service: servicio._id,
                nameService: servicio.nameService,
                quantity: s.quantity,
                priceSnapshot: servicio.price,
                total: servicio.price * s.quantity
            }
        }))

        const subtotalRecursos = recursosProcesados.reduce((sum, r) => sum + r.total, 0)
        const subtotalServicios = serviciosProcesados.reduce((sum, s) => sum + s.total, 0)

        const updatedEvent = await Event.findByIdAndUpdate(id, { nameEvent: data.nameEvent,
            host: findHost,
            date: data.date,
            hotel: findHotel,
            resources: recursosProcesados,
            pricing: {
                subtotalRecursos,
                subtotalServicios
            },
            services: serviciosProcesados,
            status: "Pending"
            }, { new: true })

        return res.status(200).json({
            message: 'Evento actualizado exitosamente',
            event: updatedEvent
        })
    } catch (error) {
        return res.status(500).json({ 
            message: 'Error al actualizar evento', 
            error: error.message
         });
    }
}