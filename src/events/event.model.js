import { Schema, model  } from "mongoose";

const eventSchema = Schema(
    {
        nameEvent: {
            type: String,
        },
        date: {
            type: String,

        }, 
        description: {
            type: String,
            required: [true, " Description is required"]

        }, 
        eventType: {
            type : String,
            required: [true, "Event Type is required"]
            
        }, 
        hotels: [{
            hotel: {
                type: Schema.Types.ObjectId,
                ref: "Hotel",
                required: true
            },
            nameHotel:{
                type:String,
                required: true 
            }
        }]

    },
    {
        timestamps: true,
        versionKey: false
    }

);

export default model('Event', eventSchema)