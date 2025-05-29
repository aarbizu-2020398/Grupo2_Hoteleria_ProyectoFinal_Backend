import { Router } from "express";
import { cancelEvent, confirmEvent, createEvent, getAllEvents, listEventsByUser, updateEvent } from "./eventController.js";
import { valueJWT } from "../middlewares/valueJWT.js";
import { createEventValidator, deleteEventValidator, updateEventValidator } from "../middlewares/validator-event.js";

const router = Router()

router.post(
    '/newEvent',
    valueJWT,
    createEventValidator,
    createEvent
)

router.put(
    "/confirmEvent/:id",
    valueJWT,
    updateEventValidator,
    confirmEvent
)

router.put(
    "/cancelEvent/:id",
    valueJWT,
    updateEventValidator,
    cancelEvent
)

router.put(
    "/editEvent/:id",
    valueJWT,
    updateEventValidator,
    updateEvent
)

router.get(
    '/allEvents',
    valueJWT,
    getAllEvents
)

router.get(
    '/eventByUser',
    valueJWT,
    listEventsByUser
)

export default router