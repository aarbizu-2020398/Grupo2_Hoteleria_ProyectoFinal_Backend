import { hash, verify } from "argon2";
import User from "../users/user.model.js"
import { jwtUtils } from "../utils/jwtUtils.js";


export const login =  async(req, res) =>{
    try {
        const lowerEmail = email ? email.toLowerCase() : null
        const lowerUser = username ? username.toLowerCase() : null

        const user = await User.findOne({
            $or: [{email: lowerEmail}, {username: lowerUser}]
        })

        const token = await jwtUtils(user.id)

        res.status(200).json({
            userDetails:{
                username: user.username,
                token: token
            }
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Server error",
            error: e.message
        })
    }
}

export const register = async(req, res) =>{
    try {
        const data = req.body
        const encryptPass = await hash(data.password)

        const userData = await User.create({
            name: data.name,
            username: data.username,
            email: data.email,
            password: encryptPass,
            phone: data.phone
        })

        return res.status(200).json({
            success: true,
            msg: "Registro realizado con exito!",
            userData
        })

    } catch (error) {
        return res.status(500).json({
            message: "Register Falied",
            error: e.message
        })
    }
}