import { Router } from "express";
import { cancelEvent, confirmEvent, createEvent, getAllEvents, listEventsByUser, updateEvent } from "./eventController.js";
import { valueJWT } from "../middlewares/valueJWT.js";


const router = Router()

router.post(
    '/newEvent',
    valueJWT,
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
    '/eventByUser',
    valueJWT,
    listEventsByUser
)

router.put(
    '/cancelEvent/:id',
    cancelEvent
)

export default router