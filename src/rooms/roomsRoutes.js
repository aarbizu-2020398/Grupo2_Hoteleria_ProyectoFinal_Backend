import { Router } from "express";
import { addRoom, deleteRoom, listRoomsByHotel, updateRoom } from "./rooms.controller.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { uploadRoomMedia } from "../middlewares/multer-Upload.js";
import { deleteRoomValidator, registerRoomValidator, updateRoomValidator } from "../middlewares/validator-room.js";
import { valueJWT } from "../middlewares/valueJWT.js";

const router = Router()

router.post(
    "/AddRoom",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadRoomMedia.single("mediaRoom"),
    registerRoomValidator,
    addRoom
)

router.put(
    "/updateRoom/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateRoomValidator,
    updateRoom
)

router.delete(
    "/deleteRoom/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    deleteRoomValidator,
    deleteRoom
)

router.get(
    "/listRooms",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listRoomsByHotel
)

export default router