import { Router } from "express";
import { deleteLounge, editLounge, listLoungesByHotel, registerLounge } from "./loungeController.js";
import { uploadLounge } from "../middlewares/multer-Upload.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { valueJWT } from "../middlewares/valueJWT.js"

const router = Router()

router.post(
    "/newLounge",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadLounge.single("mediaLounge"),
    registerLounge
)

router.put(
    "/editLounge/:id",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    editLounge
)

router.get(
    "/",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listLoungesByHotel
)

router.delete(
    "/deleteLounge/:id",
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    deleteLounge
)

export default router