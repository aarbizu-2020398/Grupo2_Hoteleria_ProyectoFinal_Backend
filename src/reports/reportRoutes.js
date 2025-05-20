import { Router } from "express";
import { getHotelStats, getPlatformStats, generateReservationReport } from "../reports/reportController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

router.use(authenticate);  // Proteger todas las rutas con autenticación

router.get('/hotel-stats', 
  roleMiddleware(['admin', 'hotel_admin']), 
  getHotelStats
);

router.get('/platform-stats', 
  roleMiddleware(['admin']), 
  getPlatformStats
);

router.get('/reservations', 
  roleMiddleware(['admin', 'hotel_admin']), 
  generateReservationReport
);

export default router;
