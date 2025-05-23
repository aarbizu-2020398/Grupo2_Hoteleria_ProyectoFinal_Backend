import { Schema, model } from "mongoose";

const FactureSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: [{
        type: {
            type: String,
            enum: ['resource', 'service', 'lounge'], // Añadido 'lounge'
            required: true
        },
        item: {
            type: Schema.Types.ObjectId,
            refPath: 'items.type',
            required: true
        },
        name: String, // Nuevo campo para nombre descriptivo
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    subtotalRecursos: {
        type: Number,
        required: true
    },
    subtotalServicios: {
        type: Number,
        required: true
    },
    subtotalLounge: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    statusInvoice: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: String,
    paymentDate: Date
}, { timestamps: true });

export default model("Factura", FactureSchema);