import { Router } from "express";
import { addRoom, deleteRoom, updateRoom } from "./rooms.controller";


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