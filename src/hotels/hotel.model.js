import { Schema, model } from "mongoose";

const hotelSchema = Schema (
    {
        nameHotel: {
            type: String,
            required: [true, "Name is required"],
            maxLenght: [25, "Cant be overcome 25 characters"]

        },
        address: {
            type: String,
            required: [true, "Addres is required"],
        },
        category: {
            type: String, 
            required: [true, "Categoty is required"]
        },
        status:{
            type: Boolean,
            defualt: true
        },
        media:{
            type: String
        },
        status:{
            type: Boolean,
            default: true
        },
        description:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true, 
        versionKey: false
    }
);
 export default model('Hotel', hotelSchema )