import { Schema, model } from "mongoose";

export const resourcesModel = Schema({
    nameResource:{
        type: String,
        required: true,
        unique: true
    },
    description: String,
    price:{
        type: Number,
        require: true
    },
    category:{
        type: String,
        enum: ["Alimentos", "Técnico", "Logística", "Personal", "Otro"],
        require: true
    },
    stock:{
        type: Number,
        min: [1, "La cantidad de stock no debe de ser negativo menor a 0"]
    },
    isActive:{
        type: Boolean,
        default: true
    }
},
{
    timeStamps: true,
    versionKey: false
})

export default model("Resources", resourcesModel)