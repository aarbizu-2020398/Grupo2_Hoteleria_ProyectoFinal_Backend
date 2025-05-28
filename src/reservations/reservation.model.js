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
            require: true,
            default: Date.now()
        },
        checkOutDate: {
            type: Date,
            require: true
        },
        totalPrice:{
            type: Number
        },
        status:{
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending"
        },
        statusActive:{
            type: Boolean,
            default: true
        }
},
{
    timestamps: true,
    versionKey: false
});

export default model("Reservation", reservationSchema)