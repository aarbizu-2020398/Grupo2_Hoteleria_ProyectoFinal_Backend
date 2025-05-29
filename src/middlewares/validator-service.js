import { body, param } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeServiceById, serviceNameExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const addServiceValidator = [
    valueJWT,
    body("nameService", "El nombre del servicio es requerido").not().isEmpty(),
    body("nameService").custom(serviceNameExiste),
    body("price", "El precio es requerido").not().isEmpty().isNumeric().custom(value => value >= 0),
    body("unitType", "El tipo de unidad es requerido").not().isEmpty().isIn(["Hora", "Dias", "Unidad", "Paquete"]),
    validarCampos
];

export const updateServiceValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeServiceById),
    body("price").optional().isNumeric().withMessage("El precio debe ser un número").custom(value => value >= 0),
    body("unitType").optional().isIn(["Hora", "Dias", "Unidad", "Paquete"]).withMessage("Tipo de unidad no válido"),
    validarCampos
];

export const deleteServiceValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeServiceById),
    validarCampos
];