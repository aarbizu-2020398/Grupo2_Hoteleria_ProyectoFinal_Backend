// src/reservations/reservationRoutes.js
import { Router } from "express";
import { createReservation, getReservationById, updateReservation, cancelReservation, getAllReservations } from "./reservationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";  // Cambio aquí
import { roleMiddleware } from "../middlewares/roleMiddleware.js";  // Asegúrate de que la ruta sea correcta

const router = Router();

// Ruta protegida para crear una reservación (solo usuarios autenticados)
router.use(authenticate); // Aquí se está usando el middleware de autenticación

router.post('/', 
    roleMiddleware(['admin', 'hotel_admin', 'user']), // Solo accesible para ciertos roles
    createReservation
);

router.get('/:id', 
    roleMiddleware(['admin', 'hotel_admin', 'user']), // Solo accesible para ciertos roles
    getReservationById
);

router.put('/:id/cancel', 
    roleMiddleware(['admin', 'hotel_admin']), // Solo accesible para admins y hotel admins
    cancelReservation
);

router.get('/', 
    roleMiddleware(['admin', 'hotel_admin', 'user']), // Solo accesible para ciertos roles
    getAllReservations
);

router.put('/:id', 
    roleMiddleware(['admin', 'hotel_admin']), // Solo accesible para admins y hotel admins
    updateReservation
);

export default router;
