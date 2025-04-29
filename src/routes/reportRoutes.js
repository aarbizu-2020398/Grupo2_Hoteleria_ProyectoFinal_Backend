const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.use(authMiddleware);


router.get('/hotel-stats', 
    roleMiddleware(['admin', 'hotel_admin']), 
    reportController.getHotelStats
);

a
router.get('/platform-stats', 
    roleMiddleware(['admin']), 
    reportController.getPlatformStats
);


router.get('/reservations', 
    roleMiddleware(['admin', 'hotel_admin']), 
    reportController.generateReservationReport
);

module.exports = router;