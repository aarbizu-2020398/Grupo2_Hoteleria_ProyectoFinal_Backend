import { Router } from "express";
import { deleteUser, getUser, updateCredentials, updateProfile } from "./user.controller.js";
import { valueJWT } from "../middlewares/valueJWT.js";

const router = Router();

 router.get(
     '/viewUser', 
     getUser  
 );

router.put(
    '/updProfile/:id', 
    valueJWT,
    updateProfile
);

router.put(
    '/updCredentials/:id', 
    valueJWT,
    updateCredentials
);

router.delete(
    "/deleteUser/:id",
    valueJWT,
    deleteUser
);


export default router;