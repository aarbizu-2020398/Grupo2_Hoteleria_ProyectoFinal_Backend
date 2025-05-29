import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeHotelById, hotelNameExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const registerHotelValidator = [
    valueJWT,
    body("nameHotel", "El nombre del hotel es requerido").not().isEmpty(),
    body("nameHotel").custom(hotelNameExiste),
    body("address", "La dirección es requerida").not().isEmpty(),
    body("category", "La categoría es requerida").not().isEmpty(),
    validarCampos
];

export const updateHotelValidator = [
    valueJWT,
    body("id").custom(existeHotelById),
    body("nameHotel").optional().not().isEmpty().withMessage("El nombre no puede estar vacío"),
    body("address").optional().not().isEmpty().withMessage("La dirección no puede estar vacía"),
    body("category").optional().not().isEmpty().withMessage("La categoría no puede estar vacía"),
    validarCampos
];

export const deleteHotelValidator = [
    valueJWT,
    body("id").custom(existeHotelById),
    validarCampos
];