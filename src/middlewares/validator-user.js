import { body, validationResult } from 'express-validator';
import { validarCampos } from "./validar-campos.js";
import { emailExiste, usernameExiste, existeUsuarioById, esRoleValido } from "../helpers/db-validator.js";
import User from "../users/user.model.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("email", "You must enter a valid email").isEmail(),
    body("username", "The username is required").not().isEmpty(),
    body("username").custom(usernameExiste),
    body("email").custom(emailExiste),
    body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
    body("phone", "Phone must be at least 8 characters").isLength({ min: 8 }),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Enter a valid email address"),
    body("username", "The username is required").optional().not().isEmpty(),
    body("email").optional().custom((email) => {
        return new Promise(async (resolve, reject) => {
            const existeEmail = await User.findOne({ email });
            if (!existeEmail) {
                return reject("El correo no está registrado");
            }
            resolve(true);
        });
    }),
    body("email", "The email is required").optional().not().isEmpty(),
    body("username").optional().isString().withMessage("Enter a valid username"),
    body("username").optional().custom((username) => {
        return new Promise(async (resolve, reject) => {
            const existeUsername = await User.findOne({ username });
            if (!existeUsername) {
                return reject("El nombre de usuario no está registrado");
            }
            resolve(true);
        });
    }),
    body("password", "Password must be at least 8 characters").isLength({min: 8}),
    validarCampos
];