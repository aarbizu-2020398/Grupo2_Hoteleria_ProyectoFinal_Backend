import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeRoomById, existeHotelById, roomNumberExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const registerRoomValidator = [
    valueJWT,
    body("hotel", "El hotel es requerido").not().isEmpty(),
    body("hotel").custom(existeHotelById),
    body("roomNumber", "El número de habitación es requerido").not().isEmpty(),
    body("roomNumber").custom((roomNumber, { req }) => roomNumberExiste(roomNumber, req.body.hotel)),
    body("floor", "El piso es requerido").not().isEmpty().isNumeric(),
    body("capacity", "La capacidad es requerida").not().isEmpty().isNumeric(),
    body("type", "El tipo de habitación es requerido").not().isEmpty(),
    body("description", "La descripción es requerida").not().isEmpty(),
    body("priceNight", "El precio por noche es requerido").not().isEmpty().isNumeric(),
    validarCampos
];

export const updateRoomValidator = [
    valueJWT,
    body("id").custom(existeRoomById),
    body("floor").optional().isNumeric().withMessage("El piso debe ser un número"),
    body("capacity").optional().isNumeric().withMessage("La capacidad debe ser un número"),
    body("type").optional().isIn(["Individual", "Doble", "Suite", "Familiar"]).withMessage("Tipo de habitación no válido"),
    body("priceNight").optional().isNumeric().withMessage("El precio debe ser un número"),
    validarCampos
];

export const deleteRoomValidator = [
    valueJWT,
    body("id").custom(existeRoomById),
    validarCampos
];