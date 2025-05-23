import { Router } from "express";
import { addRoom, deleteRoom, listRoomsByHotel, updateRoom } from "./rooms.controller.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { uploadRoomMedia } from "../middlewares/multer-Upload.js";


const router = Router()

router.post(
    "/AddRoom",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadRoomMedia.single("mediaRoom"),
    addRoom
)

router.put(
    "/updateRoom/:id",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateRoom
)

router.delete(
    "/deleteRoom/:id",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    deleteRoom
)

router.get(
    "/listRooms",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listRoomsByHotel
)

export default router