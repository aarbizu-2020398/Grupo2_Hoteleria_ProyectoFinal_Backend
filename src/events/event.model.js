import { Schema, model  } from "mongoose";

const eventSchema = Schema(
    {
        host:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        hotel: {
            type: Schema.Types.ObjectId,
            ref: "Hotel",
            required: true
        },
        nameEvent: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        resources:[{
            resource:{
                type: Schema.Types.ObjectId,
                ref: "Resources",
                required: true
            }, 
            quantity:{
                type: Number,
                default: 1,
                min: 1
            },
            priceSnapshot:{
                type: Number   
            }
        }],
        services:[{
            service:{
                type: Schema.Types.ObjectId,
                ref: "Services",
                required: true
            },
            quantity:{
                type: Number,
                default: 1,
                min: 1
            },
            timeUnit:{
                type: String,
                enum: ["Hora", "Dia"],
                required: function(){
                    return this.resource?.unitType === "Hora"
                }
            },
            timeUsed: {  
                type: Number,
                defualt: 1,
                min: 1
            },
            priceSnapshot:{
                type: Number   
            }
        }],
        pricing: {
            subtotalRecursos: Number,
            subtotalServicios: Number
        },
        status:{
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

);

export default model('Event', eventSchema)