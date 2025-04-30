import { model, Schema } from "mongoose";

const RolesModel = Schema({
    role:{
        type: String,
        require: [true, "Role Requerido"]
    }
})

export default model ("Role", RolesModel)