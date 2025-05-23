import multer from "multer";
import {dirname, extname, join} from "path"
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAXSIZE = 10000000

const createMulterConfig = (destinationPath) =>{
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) =>{
                const fullpath = join(CURRENT_DIR, destinationPath)//Da la ruta completa del archivo 
                req.filePath = fullpath
                cb(null, fullpath)
            },
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname);
                const fileName = file.originalname.split(fileExtension)[0]
                cb(null, `${fileName}-${Date.now()}${fileExtension}`)//Crea nombre único para el archivo
            }
        }),
        fileFilter: (req, file, cb) =>{
            if(MIMETYPES.includes(file.mimetype)) cb(null, true);
            else cb(new Error(`Only ${MIMETYPES.join(" ")} mymetypes are allowed`))
        },
        limits:{
            fileSize: MAXSIZE
        },
    })
}

export const uploadHotelMedia = createMulterConfig("../public/uploads/Hotel_Media");
export const uploadRoomMedia = createMulterConfig("../public/uploads/Room_Media");
export const uploadLounge = createMulterConfig("../public/uploads/Lounge_Media");