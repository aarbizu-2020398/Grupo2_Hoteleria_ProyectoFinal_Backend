const express = require('express');
const router = express.Router();
const reservationController = require('./reservationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.post('/', 
    reservationController.createReservation
);

router.get('/:id', 
    reservationController.getReservationById
);

router.put('/:id/cancel', 
    reservationController.cancelReservation
);

router.get('/', 
    roleMiddleware(['admin', 'hotel_admin', 'user']), 
    reservationController.getAllReservations
);

router.put('/:id', 
    roleMiddleware(['admin', 'hotel_admin']),
    reservationController.updateReservation
);

module.exports = router;