import { Router } from "express";
import { deteleHotelData, findHotel, registerHotel, updateHotelData } from "./hotel.controller.js";

const router = Router()

router.post(
    "/RegisterHotel",
    registerHotel
)

router.put(
    "/UpdateHotel/:id",
    updateHotelData
)

router.delete(
    "/DeleteHotel/:id",
    deteleHotelData
)

router.get(
    "/searchHotels",
    findHotel
)

export default router