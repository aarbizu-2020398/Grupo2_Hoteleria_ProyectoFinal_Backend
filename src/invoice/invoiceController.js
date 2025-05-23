import Facture from "./invoice.model.js";

export const generateFacture = async (event) => {
    try {

        console.log(event.lounge)
        const subtotalRecursos = event.resources.reduce((sum, r) => 
            sum + ((r.priceSnapshot || 0) * (r.quantity || 0)), 0);

        const subtotalServicios = event.services.reduce((sum, s) => 
            sum + ((s.priceSnapshot || 0) * (s.timeUsed || 1) * (s.quantity || 1)), 0);

        // 2. Nuevo cálculo para el lounge
        const subtotalLounge = (event.lounge.pricePerHour) * (event.durationHours || 1);

        // 3. Construcción de items
        const items = [
            // Recursos existentes
            ...event.resources.map(r => ({
                type: 'resource',
                item: r.resource._id,
                name: r.resource.nameResource, // Campo adicional
                quantity: r.quantity || 0,
                unitPrice: r.priceSnapshot || 0,
                subtotal: (r.priceSnapshot || 0) * (r.quantity || 0)
            })),
            
            // Servicios existentes
            ...event.services.map(s => ({
                type: 'service',
                item: s.service._id,
                name: s.service.nameService, // Campo adicional
                quantity: s.quantity || 0,
                unitPrice: s.priceSnapshot || 0,
                subtotal: (s.priceSnapshot || 0) * (s.timeUsed || 1) * (s.quantity || 1)
            })),
            
            // Nuevo item para el lounge
            {
                type: 'lounge',
                item: event.lounge._id,
                name: `Salón ${event.lounge.name}`, // Campo adicional
                quantity: event.durationHours || 1,
                unitPrice: event.lounge.pricePerHour || 0,
                subtotal: subtotalLounge
            }
        ];

        // 4. Creación de la factura
        const factureData = {
            event: event._id,
            client: event.host._id,
            date: new Date(),
            items,
            subtotalRecursos,
            subtotalServicios,
            subtotalLounge,
            total: subtotalRecursos + subtotalServicios + subtotalLounge,
            statusInvoice: 'pending'
        };

        const facture = new Facture(factureData);
        await facture.save();
        
        return facture;

    } catch (error) {
        //console.error("Error en generateFacture:", error);
        throw new Error(`Error al generar factura: ${error.message}`);
    }
};