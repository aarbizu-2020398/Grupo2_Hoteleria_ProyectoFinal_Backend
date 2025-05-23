import { Router } from 'express';
import { getHotelStatistics, getRoomStatistics } from './reportController.js';

const router = Router();

router.get('/hotels', getHotelStatistics);
router.get('/rooms', getRoomStatistics);

export default router;