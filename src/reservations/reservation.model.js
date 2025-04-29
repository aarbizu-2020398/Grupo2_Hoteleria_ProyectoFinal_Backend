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
        hotels: [{
            hotel: {
                type: Schema.Types.ObjectId,
                ref: "Hotel", 
                required: true 
            }, 
            nameHotel:{
                type: String,
                required: true
            }

        }], 

        checkInDate: {
            type: String
        },
        checkOutDate: {
            type: String
        }
},
{
    timestamps: true,
    versionKey: false
});

export default model("Reservation", reservationSchema)