import { body, param } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeEventById, existeLoungeById, eventNameExiste } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const createEventValidator = [
    valueJWT,
    body("nameEvent", "El nombre del evento es requerido").not().isEmpty(),
    body("nameEvent").custom(eventNameExiste),
   
    body("date", "La fecha es requerida").not().isEmpty().isISO8601(),
    body("durationHours", "La duración en horas es requerida").not().isEmpty().isNumeric(),
    validarCampos
];

export const updateEventValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeEventById),
    body("nameEvent").optional().not().isEmpty().withMessage("El nombre no puede estar vacío"),
    body("date").optional().isISO8601().withMessage("Formato de fecha inválido"),
    body("durationHours").optional().isNumeric().withMessage("La duración debe ser un número"),
    validarCampos
];

export const deleteEventValidator = [
    valueJWT,
    param("id", "Enter a valid ID").notEmpty(),
    param("id").custom(existeEventById),
    validarCampos
];