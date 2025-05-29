import { Router } from "express";
import { addRoom, deleteRoom, listRoomsByHotel, updateRoom, listAllRooms } from "./rooms.controller.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { uploadRoomMedia } from "../middlewares/multer-Upload.js";
import { valueJWT } from "../middlewares/valueJWT.js";


const router = Router()

router.post(
    "/AddRoom",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadRoomMedia.single("pictureRoom"),
    addRoom
)

router.put(
    "/updateRoom/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateRoom
)

router.delete(
    "/deleteRoom/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    deleteRoom
)

router.get(
    "/listRooms",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listRoomsByHotel
)

router.get(
    "/listAllRooms",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listAllRooms
)

export default router