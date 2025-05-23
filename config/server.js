import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { hash } from "argon2"

import authRoutes from "../src/auth/authRoutes.js"
import hotelRoutes from "../src/hotels/hotelRoutes.js"
import roomsRoutes from "../src/rooms/roomsRoutes.js"
import eventRoutes from "../src/events/eventRoutes.js"
import resourcesRoutes from "../src/resources_Events/resourcesRoutes.js"
import loungeRoutes from "../src/lounge/loungeRoutes.js"
import reportRoutes from "../src/reports/reportRoutes.js"
import { dbConnection } from "./mongo.js"

import User from "../src/users/user.model.js"

import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(express.json())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use('/uploads/Hotel_Media', express.static(path.join(__dirname, '../src/public/uploads/Hotel_Media')));
    app.use('/uploads/Lounge_Media', express.static(path.join(__dirname, '../src/public/uploads/Lounge_Media')));
    app.use('/uploads/Room_Media', express.static(path.join(__dirname, '../src/public/uploads/Room_Media')));
}

const routes = (app) =>{
    app.use("/Hotel/V1/auth", authRoutes)
    app.use("/Hotel/V1/Hotels", hotelRoutes)
    app.use("/Hotel/V1/Rooms", roomsRoutes)
    app.use("/Hotel/V1/Resources", resourcesRoutes)
    app.use("/Hotel/V1/Events", eventRoutes)
    app.use("/Hotel/V1/Lounges", loungeRoutes)
    app.use("/Hotel/V1/Report", reportRoutes)
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

export const defaultAdmin = async() =>{
    try {
        const Adminemail = "admin@gmail.com"
        const password = "admin123"

        const existAdmin = await User.findOne({email: Adminemail})

        if(!existAdmin){
            const passwordEncrypt = await hash(password)

            const adminUser = new User({
                name: "Admin",
                username: "administrador",
                email: Adminemail,
                password: passwordEncrypt,
                role: "ADMIN_PLATAFORM",
                phone: "12345678"
            })
            await adminUser.save()
            console.log("Administrador por defecto ha sido creado exitosamente!!!")
        }
        if(existAdmin){
            console.log("Ya se ha generado el Administrador")
        }

    } catch (er) {
        console.error("Error al crear el Administrador ", er)
    }
}