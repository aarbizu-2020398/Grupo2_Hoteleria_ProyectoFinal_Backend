import { Schema, model } from "mongoose";

export const servicesSchema = Schema({
    nameService: {
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        require: true,
        min: [0, "El precio no debe ser tan pequeño"]
    },
    unitType:{
        type: String,
        enum: ["Hora", "Dias", "Unidad", "Paquete"],
        default: "Unidad",
        require: true
    },
    statusActive:{
        type: Boolean,
        default: true
    }
},  
    {
    timeStamps: true,
    versionKey: false
    })

export default model("Services", servicesSchema)