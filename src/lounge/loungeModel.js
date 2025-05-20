import { Schema, model } from "mongoose";

const modelLounge = new Schema({
    name:{
        type: String,
        required: true
    },
    hotel:{
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    description:{
        type: String
    },
    pricePerHour:{
        type: Number,
        min: 500,
        required: true
    },
    minHours:{
        type: Number,
        min: 2,
        required: true
    },
    statusActive:{
        type: String,
        enum:["Active, Ocuppied"],
        defautl: "Active"
    },
    status:{
        type: Boolean,
        default: true
    }
})

export default model("Lounge", modelLounge)