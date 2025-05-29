const express = require('express');
const router = express.Router();
const reservationController = require('./reservationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { createReservationValidator, updateReservationValidator, deleteReservationValidator } = require('../middlewares/validator-reservation');

router.use(authMiddleware);

router.post('/', 
    createReservationValidator,
    reservationController.createReservation
);

router.get('/:id', 
    reservationController.getReservationById
);

router.put('/:id/cancel', 
    updateReservationValidator,
    reservationController.cancelReservation
);

router.get('/', 
    roleMiddleware(['admin', 'hotel_admin', 'user']), 
    reservationController.getAllReservations
);

router.put('/:id', 
    roleMiddleware(['admin', 'hotel_admin']),
    updateReservationValidator, 
    reservationController.updateReservation
);

module.exports = router;