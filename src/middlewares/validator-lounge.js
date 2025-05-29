import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeLoungeById, existeHotelById, loungeNameExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const registerLoungeValidator = [
    valueJWT,
    body("name", "El nombre del salón es requerido").not().isEmpty(),
    body("name").custom(loungeNameExiste),
    body("hotel", "El hotel es requerido").not().isEmpty(),
    body("hotel").custom(existeHotelById),
    body("pricePerHour", "El precio por hora es requerido").not().isEmpty().isNumeric().custom(value => value >= 500),
    validarCampos
];

export const updateLoungeValidator = [
    valueJWT,
    body("id").custom(existeLoungeById),
    body("name").optional().not().isEmpty().withMessage("El nombre no puede estar vacío"),
    body("pricePerHour").optional().isNumeric().withMessage("El precio debe ser un número").custom(value => value >= 500),
    validarCampos
];

export const deleteLoungeValidator = [
    valueJWT,
    body("id").custom(existeLoungeById),
    validarCampos
];