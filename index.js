import { config } from "dotenv";
import { defaultAdmin, initServer } from "./config/server.js"

config()
initServer()
defaultAdmin()