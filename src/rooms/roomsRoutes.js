import { Router } from "express";
import { addRoom, deleteRoom, updateRoom } from "./rooms.controller.js";


const router = Router()

router.post(
    "/AddRoom",
    addRoom
)

router.put(
    "/updateRoom/:id",
    updateRoom
)

router.delete(
    "/deleteRoom/:id",
    deleteRoom
)

export default router