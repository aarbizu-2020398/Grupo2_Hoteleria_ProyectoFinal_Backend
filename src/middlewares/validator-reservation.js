import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeReservationById, existeRoomById, existeUsuarioById } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const createReservationValidator = [
    valueJWT,
    body("room", "La habitación es requerida").not().isEmpty(),
    body("room").custom(existeRoomById),
    body("checkInDate", "La fecha de entrada es requerida").not().isEmpty().isISO8601(),
    body("checkOutDate", "La fecha de salida es requerida").not().isEmpty().isISO8601(),
    body("guests", "El número de huéspedes es requerido").not().isEmpty().isNumeric().custom(value => value >= 1),
    validarCampos
];

export const updateReservationValidator = [
    valueJWT,
    body("id").custom(existeReservationById),
    body("checkInDate").optional().isISO8601().withMessage("Formato de fecha de entrada inválido"),
    body("checkOutDate").optional().isISO8601().withMessage("Formato de fecha de salida inválido"),
    body("guests").optional().isNumeric().withMessage("El número de huéspedes debe ser un número").custom(value => value >= 1),
    body("status").optional().isIn(["Pending", "Confirmed", "Cancelled"]).withMessage("Estado no válido"),
    validarCampos
];

export const deleteReservationValidator = [
    valueJWT,
    body("id").custom(existeReservationById),
    validarCampos
];