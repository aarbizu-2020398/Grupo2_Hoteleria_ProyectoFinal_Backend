import { Schema, model  } from "mongoose";

const roomSchema = Schema(
    {
        floor: {
            type: Number,
        },
        ability: {
            type: String,
        }, 
        type: {
            type: String, // "individual", "doble", "suite", "familiar"
        },
        description: {
            type: String,
        }, 
        price: {
            type: Number ,
        },
        availability: {
            type: Boolean,
            default: false

        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Room', roomSchema)