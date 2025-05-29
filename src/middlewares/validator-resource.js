import { body, param } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeResourceById, resourceNameExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const addResourceValidator = [
    valueJWT,
    body("nameResource", "El nombre del recurso es requerido").not().isEmpty(),
    body("nameResource").custom(resourceNameExiste),
    body("price", "El precio es requerido").not().isEmpty().isNumeric(),
    body("category", "La categoría es requerida").not().isEmpty().isIn(["Alimentos", "Técnico", "Logística", "Personal", "Otro"]),
    body("stock", "El stock es requerido").not().isEmpty().isNumeric().custom(value => value >= 1),
    validarCampos
];

export const updateResourceValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeResourceById),
    body("price", "El precio es requerido").not().isEmpty().isNumeric(),
    body("category").optional().isIn(["Alimentos", "Técnico", "Logística", "Personal", "Otro"]).withMessage("Categoría no válida"),
    body("stock").optional().isNumeric().withMessage("El stock debe ser un número").custom(value => value >= 1),
    validarCampos
];

export const deleteResourceValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeResourceById),
    validarCampos
];