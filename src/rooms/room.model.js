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
        },
        capacity: {
            type: String,
        }, 
        type: {
            type: String, 
            enum: ["Individual", "Doble", "Suite", "Familiar"],
            require: true
        },
        description: {
            type: String,
        }, 
        priceNight: {
            type: Number ,
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
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Room', roomSchema)