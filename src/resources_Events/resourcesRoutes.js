import { Router } from "express";
import { addResources, listResources, addServices, deleteResources, deleteServices, editResources, editServices, listServices } from "./resourcesController.js";
import { valueJWT } from "../middlewares/valueJWT.js";
import { validateRole } from "../middlewares/validate-Role.js";

const router = Router()

router.post(
    "/newService",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    addServices
)

router.get(
    "/listServices",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    listServices
)

router.get(
    "/listResources",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    listResources
)

router.post(
    "/newResource",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    addResources
)

router.put(
    "/editService/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    editServices
)

router.put(
    "/editResource/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    editResources
)

router.delete(
    "/deleteResource/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    deleteResources
)

router.delete(
    "/deleteService/:id",
    valueJWT,
    validateRole("ADMIN_PLATAFORM"),
    deleteServices
)

export default router