import { Router } from "express";
import {deleteFileOnError} from "../middlewares/delete-fileOnError.js"
import { deteleHotelData, findHotel, registerHotel, updateHotelData } from "./hotel.controller.js";
import { uploadHotelMedia } from "../middlewares/multer-Upload.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { valueJWT } from "../middlewares/valueJWT.js";

const router = Router()

router.post(
    "/RegisterHotel",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    uploadHotelMedia.single("pictureHotel"),
    deleteFileOnError,
    registerHotel
)

router.put(
    "/UpdateHotel/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    updateHotelData
)

router.delete(
    "/DeleteHotel/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    deteleHotelData
)

router.get(
    "/searchHotels",
    valueJWT,
    validateRole("USER", "ADMIN_PLATAFORM"),
    findHotel
)

export default router