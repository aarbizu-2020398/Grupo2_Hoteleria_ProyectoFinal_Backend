import { hash, verify } from "argon2";
import User from "../users/user.model.js"
import { jwtUtils } from "../utils/jwtUtils.js";


export const login =  async(req, res) =>{
    try {

        const {email, username, password} = req.body

        const lowerEmail = email ? email.toLowerCase() : null
        const lowerUsername = username ? username.toLowerCase() : null

        const user = await User.findOne({
            $or: [{email: lowerEmail}, {username: lowerUsername}]
        })
        
        const verPass = await verify(user.password, password)

        if(!verPass){
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }

        const token = await jwtUtils(user.id)

        return res.status(200).json({
            userDetails:{
                username: user.username,
                token: token,
                role: user.role
            }
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: error.message
        })
    }
}

export const register = async(req, res) =>{
    try {
        const {name, username, email, password, phone} = req.body
        
        const encryptPass = await hash(password)
        
        
        const userData = await User.create({
            name: name,
            username: username,
            email: email,
            password: encryptPass, 
            phone: phone
        })
        
        return res.status(201).json({
            success: true,
            msg: "Registro realizado con exito!",
            userData
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Register Falied",
            error: error.message
        })
    }
}