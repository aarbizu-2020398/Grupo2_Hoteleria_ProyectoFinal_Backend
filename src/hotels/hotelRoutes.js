import { Router } from "express";
import { deteleHotelData, findHotel, registerHotel, updateHotelData } from "./hotel.controller.js";
import { uploadHotelMedia } from "../middlewares/multer-Upload.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { deleteHotelValidator, registerHotelValidator, updateHotelValidator } from "../middlewares/validator-hotel.js";
import { valueJWT } from "../middlewares/valueJWT.js";

const router = Router()

router.post(
    "/RegisterHotel",
    valueJWT,  // Primero verificar el token
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),  // Luego verificar el rol
    uploadHotelMedia.single("media"),
    registerHotelValidator,  // Este ya incluye valueJWT pero no afectará
    registerHotel
)

router.put(
    "/UpdateHotel/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateHotelValidator,
    updateHotelData
)

router.delete(
    "/DeleteHotel/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL"),
    deleteHotelValidator,
    deteleHotelData
)

router.get(
    "/searchHotels",
    valueJWT,
    validateRole("ADMIN_HOTEL", "USER", "ADMIN_PLATAFORM"),
    findHotel
)

export default router