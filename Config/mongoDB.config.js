import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

const connection_string = `${ENVIRONMENT.MONGO_DB_URI}/${ENVIRONMENT.MONGO_DB_NAME}`

export async function connectMongoDB() {
    try {
        /* bloque de código a ejecutar */
        await mongoose.connect(
            connection_string
        )
        console.log("Conexión realizada a MongoDB")
    } 
    catch (error) {
        console.error("Fallo de conexión")
        console.error(error)    
    }
}

