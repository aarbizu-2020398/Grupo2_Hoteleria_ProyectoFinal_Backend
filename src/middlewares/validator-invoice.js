import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeFactureById, existeEventById, existeUsuarioById } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const createInvoiceValidator = [
    valueJWT,
    body("event", "El evento es requerido").not().isEmpty(),
    body("event").custom(existeEventById),
    body("client", "El cliente es requerido").not().isEmpty(),
    body("client").custom(existeUsuarioById),
    validarCampos
];

export const getInvoiceValidator = [
    valueJWT,
    body("id").custom(existeFactureById),
    validarCampos
];