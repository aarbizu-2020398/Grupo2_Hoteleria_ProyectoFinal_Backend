import { Schema, model } from "mongoose";

const reservationSchema = Schema (
    {
        user:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true 
        }, 
        room :{
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: true 
        },
        checkInDate: {
            type: Date,
            require: true
        },
        checkOutDate: {
            type: Date,
            require: true
        },
        totalPrice:{
            type: Number
        },
        guests:{
            type: Number,
            required: true,
            min: 1 
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
});

export default model("Reservation", reservationSchema)