import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../Config/environment.config.js'
import { request, response } from 'express'
import ServerError from '../Helpers/error.helpers.js';

function authMiddleware (request, response, next){
    try {
        const authorization_header = request.headers.authorization
        
        if(!authorization_header){
            throw new ServerError('No autorizado', 401)
        }
        const auth_token = authorization_header.split(' ')[1]

        if(!auth_token){
            throw new ServerError('No autorizado', 401)
        }
        const user = jwt.verify(auth_token, ENVIRONMENT.JWT_SECRET_KEY)

        /* guarda los datos de sesión del usuario (que serían los datos que tiene el token) username, email, id */
        request.user = user
        next()
    }

    catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return response.json({
                message: 'No autorizado', 
                ok: false,
                status: 401,
                data: null
            })
        }

        /* SI tiene 'status' es un error controlado. Es decir es esperable */
        if (error.status) {
            return response.json({
                message: error.message,
                ok: false,
                status: error.status,
                data: null
            })
        }
        
        /* esto de abajo sería el error de servidor si algo sale mal */
        return response.json({
            message: 'Error interno del servidor',
            ok: false,
            status: 500,
            data: null
        })
    }
}



export default authMiddleware