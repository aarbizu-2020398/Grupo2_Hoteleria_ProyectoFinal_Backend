import { Router } from "express";
import { addResources, addServices, deleteResources, deleteServices, editResources, editServices } from "./resourcesController.js";
import { addResourceValidator, deleteResourceValidator, updateResourceValidator } from "../middlewares/validator-resource.js";
import { addServiceValidator, deleteServiceValidator, updateServiceValidator } from "../middlewares/validator-service.js";
import { valueJWT } from "../middlewares/valueJWT.js";

const router = Router()

router.post(
    "/newService",
    valueJWT,
    addServiceValidator,
    addServices
)

router.post(
    "/newResource",
    valueJWT,
    addResourceValidator,
    addResources
)

router.put(
    "/editService/:id",
    valueJWT,
    updateServiceValidator,
    editServices
)

router.put(
    "/editResource/:id",
    valueJWT,
    updateResourceValidator,
    editResources
)

router.delete(
    "/deleteResource/:id",
    valueJWT,
    deleteResourceValidator,
    deleteResources
)

router.delete(
    "/deleteService/:id",
    valueJWT,
    deleteServiceValidator,
    deleteServices
)

export default router