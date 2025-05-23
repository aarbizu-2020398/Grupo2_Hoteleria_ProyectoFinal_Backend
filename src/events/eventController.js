import Lounge from "../lounge/loungeModel.js";
import Event from "./event.model.js"
import Resources from "../resources_Events/resourcesModel.js";
import Services from "../resources_Events/servicesModel.js";
import User from "../users/user.model.js";
import { generateFacture } from "../invoice/invoiceController.js";

export const createEvent = async (req, res) => {
    try {
        const data = req.body;
        const { services = [], resources = [] } = req.body;

        const findLounge = await Lounge.findOne({ name: data.lounge })
        
        const findHost  = req.user._id
        
        const recursosProcesados = await Promise.all(resources.map(async r => {
            const recurso = await Resources.findOne({ nameResource: r.resource });
            return {
                resource: recurso._id,
                nameResource: recurso.nameResource,
                quantity: r.quantity,
                timeUnit: r.timeUnit,
                priceSnapshot: recurso.price,
                total: recurso.price * r.quantity
            };
        }));
         
        const serviciosProcesados = await Promise.all(services.map(async s => {
            const servicio = await Services.findOne({ nameService: s.service });
            let precioTotal = 0;
            let timeUsed = s.timeUsed || 1;
            
            if (servicio.unitType === "Hora" || servicio.unitType === "Dia") {
                if (servicio.unitType === "Dia" && s.timeUnit === "Hora") {
                    timeUsed = s.timeUsed / 24;
                } else if (servicio.unitType === "Hora" && s.timeUnit === "Dia") {
                    timeUsed = s.timeUsed * 24;
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
            };
        }));
        
        const subtotalRecursos = recursosProcesados.reduce((sum, r) => sum + r.total, 0);
        const subtotalServicios = serviciosProcesados.reduce((sum, s) => sum + s.total, 0);
        const subtotalSalon = findLounge.pricePerHour * data.durationHours;
         
        const newEvent = await Event.create({
            nameEvent: data.nameEvent,
            host: findHost,
            date: data.date,
            lounge: findLounge,
            durationHours: data.durationHours, 
            resources: recursosProcesados,
            services: serviciosProcesados,
            pricing: {
                subtotalRecursos,
                subtotalServicios,
                subtotalSalon
            }
        });
        
        await Lounge.findOneAndUpdate({name: data.lounge}, {statusActive: "Pending"}, {new: true})
        return res.status(200).json({
            msg: "Evento creado con éxito!",
            newEvent
        });
        
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

        const eventUpdate = await Event.findByIdAndUpdate(id, {status: "Confirmed"}, {new: true}).populate("resources.resource services.service").populate("lounge")        
        
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
        
        await Lounge.findOneAndUpdate({name: event.lounge}, {statusActive: "Active"}, {new: true})
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
    const query = { status: "Confirmed" };
    try {
        const events = await Event.find(query)
            .populate('lounge', 'name pricePerHour') 
            .populate('host', 'name email')
            .select('date nameEvent lounge host') 
            .lean();

        const formattedEvents = events.map(event => ({
            eventName: event.nameEvent,
            date: event.date,
            lounge: { 
                name: event.lounge?.name || "Salón no encontrado", 
                pricePerHour: event.lounge?.pricePerHour || "Precio no disponible" 
            },
            host: { 
                name: event.host?.name || "Anfitrión no encontrado", 
                email: event.host?.email || "Correo no disponible" 
            },
        }));

        const total = await Event.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            formattedEvents
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, // Añadido para consistencia
            message: 'Error al obtener eventos', 
            error: error.message 
        });
    }
};


export const listEventsByUser = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { desde = 0, limite = 50 } = req.query;

        const [total, events] = await Promise.all([
            Event.countDocuments({ host: userId, status: "Confirmed" }),
            Event.find({ host: userId, status: "Confirmed" })
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('lounge', 'name pricePerHour')
                .populate('resources.resource', 'nameResource type')
                .populate('services.service', 'nameService price')
        ]);

        return res.status(200).json({
            success: true,
            total,
            events
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const { services = [], resources = []} = req.body;


        const findLounge = await Lounge.findOne({ name: data.lounge });

        // Verificar horas mínimas
        if (data.durationHours < findLounge.minHours) {
            return res.status(400).json({
                message: `La duración mínima para este salón es de ${findLounge.minHours} horas`
            });
        }

        const findHost = await User.findOne({ name: data.host });

        const recursosProcesados = await Promise.all(resources.map(async r => {
            const recurso = await Resources.findOne({ nameResource: r.resource });

            let precioTotal = recurso.price;
            if (recurso.unitType === 'Hora' && r.timeUnit) {
                const horas = convertirATiempo(r.timeUnit);
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
            };
        }));

        const serviciosProcesados = await Promise.all(services.map(async s => {
            const servicio = await Services.findOne({ nameService: s.service });

            return {
                service: servicio._id,
                nameService: servicio.nameService,
                quantity: s.quantity,
                priceSnapshot: servicio.price,
                total: servicio.price * s.quantity
            };
        }));

        const subtotalRecursos = recursosProcesados.reduce((sum, r) => sum + r.total, 0);
        const subtotalServicios = serviciosProcesados.reduce((sum, s) => sum + s.total, 0);
        const subtotalLounge = findLounge.pricePerHour * data.durationHours;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { 
                nameEvent: data.nameEvent,
                host: findHost._id,
                date: data.date,
                lounge: findLounge._id,
                durationHours: data.durationHours, 
                resources: recursosProcesados,
                services: serviciosProcesados,
                pricing: {
                    subtotalRecursos,
                    subtotalServicios,
                    subtotalLounge
                },
                status: "Pending"
            },
            { new: true }
        ).populate('lounge host');
        
        await Lounge.findOneAndUpdate({name: data.lounge}, {statusActive: "Pending"}, {new: true})
        return res.status(200).json({
            message: 'Evento actualizado exitosamente',
            updatedEvent
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};