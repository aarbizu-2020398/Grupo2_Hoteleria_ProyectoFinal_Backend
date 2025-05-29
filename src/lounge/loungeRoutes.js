import { Router } from "express";
import { deleteLounge, editLounge, listLoungesByHotel, registerLounge } from "./loungeController.js";
import { uploadLounge } from "../middlewares/multer-Upload.js";
import { validateRole } from "../middlewares/validate-Role.js";
import { valueJWT } from "../middlewares/valueJWT.js";
import { deleteLoungeValidator, registerLoungeValidator, updateLoungeValidator } from "../middlewares/validator-lounge.js";

const router = Router()

router.post(
    "/newLounge",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    uploadLounge.single("mediaLounge"),
    registerLoungeValidator,
    registerLounge
)

router.put(
    "/editLounge/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    updateLoungeValidator,
    editLounge
)

router.get(
    "/",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM", "USER"),
    listLoungesByHotel
)

router.delete(
    "/deleteLounge/:id",
    valueJWT,
    validateRole("ADMIN_HOTEL", "ADMIN_PLATAFORM"),
    deleteLoungeValidator,
    deleteLounge
)

export default router