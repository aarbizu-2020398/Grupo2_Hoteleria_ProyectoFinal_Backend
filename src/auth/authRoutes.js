import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { loginValidator, registerValidator } from "../middlewares/validator-user.js";

const router = Router()

router.post(
    "/login",
    loginValidator,
    login
)

router.post(
    "/register",
    registerValidator,
    register
)

export default router