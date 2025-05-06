import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import authRoutes from "../src/auth/authRoutes.js"
import hotelRoutes from "../src/hotels/hotelRoutes.js"
import roomsRoutes from "../src/rooms/roomsRoutes.js"
import eventRoutes from "../src/events/eventRoutes.js"
import resourcesRoutes from "../src/resources_Events/resourcesRoutes.js"
import { dbConnection } from "./mongo.js"


const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan("dev"))
}

const routes = (app) =>{
    app.use("/Hotel/V1/auth", authRoutes)
    app.use("/Hotel/V1/Hotels", hotelRoutes)
    app.use("/Hotel/V1/Rooms", roomsRoutes)
    app.use("/Hotel/V1/Resources", resourcesRoutes)
    app.use("/Hotel/V1/Events", eventRoutes)
}

const conectDB = async() =>{
    try {
        await dbConnection()
        console.log("CONEXIÓN EXITOSA A LA BASE DE DATOS")
    } catch (err) {
        console.log("error al intentar conectar con la base da datos")
        process.exit(1)
    }
}

export const initServer = async() =>{
    const app  = express()
    const Port = process.env.PORT || 3000
    try {
        middlewares(app)
        conectDB()
        routes(app)
        app.listen(Port)
        console.log(`Server init in port ${Port}`)
    } catch (err) {
        console.log(`Server falied init ${Port}`)
    }
}