import { Router } from "express";
import { cancelEvent, confirmEvent, createEvent, getAllEvents, listEventsByUser, updateEvent } from "./eventController.js";
import { valueJWT } from "../middlewares/valueJWT.js";
import { validateRole } from "../middlewares/validate-Role.js";

const router = Router()

router.post(
    '/newEvent',
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    createEvent
)

router.put(
    "/confirmEvent/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    confirmEvent
)

router.put(
    "/cancelEvent/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    cancelEvent
)

router.put(
    "/editEvent/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    updateEvent
)

router.get(
    '/allEvents',
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    getAllEvents
)


router.get(
    '/eventByUser',
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    listEventsByUser
)

router.put(
    '/cancelEvent/:id',
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    cancelEvent
)

export default router