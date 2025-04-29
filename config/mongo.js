"use strict"

import mongoose from "mongoose"

export const dbConnection = async() =>{
    try {
        mongoose.connection.on('error',()=>{
            console.log("MongoDB error | error conection to MongoDB")
            mongoose.disconnect()//
        })

        mongoose.connection.on('connecting', ()=>{
            console.log("MongoDB Connection | Trying to connect to MongoDB")
        })
       
        mongoose.connection.on('connected', ()=>{
            console.log("Mongo DB | Connected to MongoDB")
        })
         
        mongoose.connection.on('reconnected', ()=>{
            console.log("Mongo DB | reconnected to MongoDB")
        })
        
        mongoose.connection.on('disconnected', ()=>{
            console.log("Mongo DB | disconnected")
        })

        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (err) {
        console.error(err)
    }
}