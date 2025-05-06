import { Router } from "express";
import { cancelEvent, confirmEvent, createEvent, getAllEvents, getEventById, updateEvent } from "./eventController.js";


const router = Router()

router.post(
    '/newEvent',
    createEvent
)

router.put(
    "/confirmEvent/:id",
    confirmEvent
)

router.put(
    "/cancelEvent/:id",
    cancelEvent
)

router.put(
    "/editEvent/:id",
    updateEvent
)

router.get(
    '/allEvents',
    getAllEvents
)

router.get(
    '/eventById/:id',
    getEventById
)

router.put(
    '/cancelEvent/:id',
    cancelEvent
)

export default router