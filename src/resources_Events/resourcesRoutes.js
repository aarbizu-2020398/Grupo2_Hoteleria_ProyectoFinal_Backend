import { Router } from "express";
import { addResources, addServices, deleteResources, deleteServices, editResources, editServices } from "./resourcesController.js";

const router = Router()

router.post(
    "/newService",
    addServices
)

router.post(
    "/newResource",
    addResources
)

router.put(
    "/editService/:id",
    editServices
)

router.put(
    "/editResource/:id",
    editResources
)

router.delete(
    "/deleteResource/:id",
    deleteResources
)

router.delete(
    "/deleteService/:id",
    deleteServices
)

export default router