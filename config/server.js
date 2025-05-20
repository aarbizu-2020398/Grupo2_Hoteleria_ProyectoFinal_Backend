// src/config/server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import winston from 'winston';

// Importar las rutas
import reportRoutes from "../src/reports/reportRoutes.js";  
import authRoutes from "../src/auth/authRoutes.js";
import hotelRoutes from "../src/hotels/hotelRoutes.js";
import roomsRoutes from "../src/rooms/roomsRoutes.js";
import eventRoutes from "../src/events/eventRoutes.js";
import resourcesRoutes from "../src/resources_Events/resourcesRoutes.js";
import reservationRoutes from "../src/reservations/reservationRoutes.js";
import roleRoutes from "../src/roles/roles.routes.js";

// Conexión a la base de datos
import { dbConnection } from "./mongo.js";

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("dev"));
};

const routes = (app) => {
  app.use("/Hotel/V1/auth", authRoutes);
  app.use("/Hotel/V1/Hotels", hotelRoutes);
  app.use("/Hotel/V1/Rooms", roomsRoutes);
  app.use("/Hotel/V1/Events", eventRoutes);
  app.use("/Hotel/V1/Resources", resourcesRoutes);
  app.use("/Hotel/V1/Reports", reportRoutes);  // Usando rutas de reportes
  app.use("/Hotel/V1/Reservations", reservationRoutes);
  app.use("/Hotel/V1/Roles", roleRoutes);
};

const connectDB = async () => {
  try {
    await dbConnection();
    logger.info("Conexión a la base de datos exitosa");
  } catch (err) {
    logger.error("Error al intentar conectar con la base de datos");
    process.exit(1);
  }
};

export const initServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000;
  try {
    middlewares(app);
    connectDB();
    routes(app);
    app.listen(port);
    logger.info(`Servidor en ejecución en el puerto ${port}`);
  } catch (err) {
    logger.error(`Error al iniciar el servidor en el puerto ${port}`);
  }
};
