import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { existeRoleById, esRoleValido } from "../helpers/db-validator.js";
import { valueJWT } from "./valueJWT.js";

export const createRoleValidator = [
    valueJWT,
    body("role", "El rol es requerido").not().isEmpty(),
    validarCampos
];

export const updateRoleValidator = [
    valueJWT,
    body("id").custom(existeRoleById),
    body("role", "El rol es requerido").not().isEmpty(),
    validarCampos
];

export const deleteRoleValidator = [
    valueJWT,
    body("id").custom(existeRoleById),
    validarCampos
];