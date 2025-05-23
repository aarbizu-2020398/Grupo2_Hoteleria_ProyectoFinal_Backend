import { Schema, model  } from "mongoose";

const roomSchema = Schema(
    {
        hotel:{
            type: Schema.Types.ObjectId,
            ref: "Hotel",
            require: true
        },
        roomNumber:{
            type: String,
            require: true
        },
        floor: {
            type: Number,
            required: true
        },
        capacity: {
            type: Number,
            required: true
        }, 
        comfort:[{
            comodidades:{
                type: String
            }
        }],
        type: {
            type: String, 
            enum: ["Individual", "Doble", "Suite", "Familiar"],
            require: true
        },
        description: {
            type: String,
            required: true
        }, 
        priceNight: {
            type: Number ,
            required: true
        },
        availability: [{
                date:{
                    type: Date,
                    default: false
                },
                isAviable:{
                    type: Boolean,
                    default: true
                }
        }],
        status: {
            type: String,
            enum: ["available", "occupied", "maintenance"],
            default: "available"
        },
        statusActive:{
            type: Boolean,
            defualt: true
        },
        media:{
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Room', roomSchema)