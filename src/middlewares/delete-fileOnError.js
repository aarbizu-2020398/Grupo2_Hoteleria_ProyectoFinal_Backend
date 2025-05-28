import { unlink } from "fs"
import fs from "fs/promises"
import { join } from "path"

export const deleteFileOnError = async (err, req, res, next) =>{
    if(req.file && req.filePath){
        const filePath = join(req.filePath, req.file.fileName)
        try {
            await fs.unlink(filePath)
        } catch (unlinkErr) {
            console.error(`error deleting file:`, unlinkErr)
        }
        if(err.status == 400 || err.errors){
            return res.status(400).json({
                sucess: false, 
                errors: err.erros
            })
        }
        return res.status(500).json({
            sucess: false,
            msg: err.message
        })
    }
}