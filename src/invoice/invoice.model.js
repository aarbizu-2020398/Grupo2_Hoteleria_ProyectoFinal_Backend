import { model, Schema } from "mongoose";
/*

const modelFactura = Schema({
    invoiceEvent:{
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },  
    client:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    date:{
        type: Date,
        default: Date.now
    },
    items:{

    }
     
    total:{
        type: Number
    }
    
},
    {
        timeStamps: true,
        versionKey: false
    }
)


*/
const Facture = Schema({  
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
            enum: ['resource', 'service'], 
            required: true 
        },
        item: { 
            type: Schema.Types.ObjectId, 
            refPath: 'items.type', required: true 
        },
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

///export default model("Factura", modelFactura)
export default model("Factura", Facture)