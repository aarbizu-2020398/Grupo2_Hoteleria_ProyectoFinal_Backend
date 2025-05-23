import { Router } from "express";
import { deteleHotelData, findHotel, registerHotel, updateHotelData } from "./hotel.controller.js";
import { uploadHotelMedia } from "../middlewares/multer-Upload.js";
import { validateRole } from "../middlewares/validate-Role.js";

const router = Router()

router.post(
    "/RegisterHotel",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadHotelMedia.single("media"),
    registerHotel
)

router.put(
    "/UpdateHotel/:id",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateHotelData
)

router.delete(
    "/DeleteHotel/:id",
    validateRole("ADMIN_HOTEL"),
    deteleHotelData
)

router.get(
    "/searchHotels",
    validateRole("ADMIN_HOTEL", "USER", "ADMIN_PLATAFORM"),
    findHotel
)

export default router