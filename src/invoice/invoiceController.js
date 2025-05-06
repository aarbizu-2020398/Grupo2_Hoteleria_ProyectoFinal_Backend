import Facture from "./invoice.model.js"

export const generateFacture = async (event) => {

    const subtotalRecursos = event.resources.reduce((sum, item) => {
        return sum + ((item.priceSnapshot || 0) * (item.quantity || 0));
    }, 0);
    
    const subtotalServicios = event.services.reduce((total, item) => {
        const tiempo = (item.timeUsed || 1);
        return total + ((item.priceSnapshot || 0) * tiempo * (item.quantity || 1));
    }, 0);

    
    const total = subtotalRecursos + subtotalServicios;

    const items = [
        ...event.resources.filter(r => r.resource).map(r => ({
            type: 'resource',
            item: r.resource._id,
            quantity: r.quantity || 0,
            unitPrice: r.priceSnapshot || 0,
            subtotal: (r.priceSnapshot || 0) * (r.quantity || 0)
        })),
        ...event.services.filter(s => s.service).map(s => ({
            type: 'service',
            item: s.service._id,
            quantity: s.quantity || 0,
            unitPrice: s.priceSnapshot || 0,
            subtotal: (s.priceSnapshot || 0) * (s.quantity || 0)
        }))
    ];

    const factureData = {
        event: event._id,
        client: event.host._id,
        date: new Date(),
        items,
        subtotalRecursos,
        subtotalServicios,
        total,
        statusInvoice: 'pending'
    };

    const facture = new Facture(factureData);
    await facture.save();
    
    return facture;
}