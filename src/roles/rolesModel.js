import { Schema, model } from "mongoose";

const RolesModel = Schema({
    role: {
        type: String,
        required: [true, "Role Requerido"]
    }
});

export default model("Role", RolesModel);
