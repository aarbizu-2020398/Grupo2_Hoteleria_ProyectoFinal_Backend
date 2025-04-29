const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);


router.use(authMiddleware);

router.post('/', 
    roleMiddleware(['admin', 'hotel_admin']), 
    eventController.createEvent
);

router.put('/:id', 
    roleMiddleware(['admin', 'hotel_admin']), 
    eventController.updateEvent
);

router.put('/:id/cancel', 
    roleMiddleware(['admin', 'hotel_admin']), 
    eventController.cancelEvent
);

module.exports = router;