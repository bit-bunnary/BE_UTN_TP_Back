import ENVIRONMENT from "../Config/environment.config.js"
import userRepository from "../Repositories/user.repository.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mailTransporter from "../Config/mail.config.js"
import ServerError from "../Helpers/error.helpers.js"

class AuthController {
    async register (request, response){
        try {

            console.log("1 - Entró al register")

            const { email, password, username } = request.body
            if (!email || !password || !username) {
                throw new ServerError('Error: Nombre, Email o Usuario inválido', 400)
            }

            const emailNormalized = email.toLowerCase().trim()

            const user = await userRepository.buscarUnoPorEmail(emailNormalized)
            if (user) {
                throw new ServerError('El email ya está registado', 400)
            }

            let hashed_password = await bcrypt.hash(password, 10)
            console.log("2 - Password hasheada")

            await userRepository.crear({
                username,
                email,
                password: hashed_password
            })

            console.log("3 - Usuario creado en DB")

            const verification_email_token = jwt.sign(
                { email: email },
                ENVIRONMENT.JWT_SECRET_KEY
            )

            console.log("4 - Token generado")
            console.log("ANTES DE ENVIAR MAIL")

            try {
                const info = await mailTransporter.sendMail({
                    from: ENVIRONMENT.GMAIL_USER,
                    to: emailNormalized,
                    subject: 'Verifica tu Email 💌',
                    html: 
                    `
                        <h1>👋 Bienvenidx ${username}</h1>
                        <p>📣 Es obligatorio que verifiques tu email</p>
                        <p>
                            Haz click en 
                                <a href="${ENVIRONMENT.URL_BACKEND}/api/auth/verify-email?verification_email_token=${verification_email_token}">
                                    "Verificar"
                                </a> 
                            para confirmar tu correo electrónico.
                        </p>
                        <br>
                        <span>Si no fuiste tú quien generó este registro, es posible que otra persona esté usando tu cuenta. Revisa y protege tu cuenta ahora.</span>
                    `
                })

                console.log("5 - MAIL ENVIADO OK")
                console.log(info)

            } catch (error) {
                console.log("ERROR EN SENDMAIL:", error.code, error.response, error.message);
            }

            console.log("DESPUÉS DE ENVIAR MAIL")

            return response.json({
                message: 'Usuario creado exitosamente! (￣▽￣)',
                ok: true,
                status: 201,
                data: null
            })

        } catch (error) {

            console.log("ERROR GENERAL:", error) // 👈 MUY IMPORTANTE

            if (error.status) {
                return response.json({
                    message: error.message,
                    ok: false,
                    status: error.status,
                    data: null
                })
            }

            return response.json({
                message: 'Error interno del servidor',
                ok: false,
                status: 500,
                data: null
            })
        }
    }

    async login (request, response){
        try {
            const { email, password } = request.body
            if (!email) {
                throw new ServerError('Debes enviar un email', 400)
            }
            else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
                throw new ServerError('El email no es válido', 400)
            }

            const usuario_encontrado = await userRepository.buscarUnoPorEmail(email)
            if (!usuario_encontrado) {
                throw new ServerError('Credenciales inválidas', 401) /* No encuentra al user pero mejor dejarlo con el mismo error q pass */
            }
            if (!(await bcrypt.compare(password, usuario_encontrado.password))) {
                throw new ServerError('Credenciales inválidas', 401)
            }
            if (!usuario_encontrado.email_verified){
                throw new ServerError('Usuario con email no verificado', 401)
            }

            const datos_del_token = {
                username: usuario_encontrado.username,
                email: usuario_encontrado.email,
                id: usuario_encontrado.id
            }
            const auth_token = jwt.sign(datos_del_token, ENVIRONMENT.JWT_SECRET_KEY)
            return response.json({
                message: 'Login exitoso',
                ok: true,
                status: 200,
                data: {
                    auth_token: auth_token
                }
            })
        }
        
        catch (error) {
            if (error.status) {
                return response.json({
                    message: error.message,
                    ok: false,
                    status: error.status,
                    data: null
                })
            }
            return response.json({
                message: 'Error interno del servidor',
                ok: false,
                status: 500,
                data: null
            })
        }
    }

    async verifyEmail (request, response){
        try {
            const {verification_email_token} = request.query
            if(!verification_email_token){
                throw new ServerError('Debes enviar el token de verificación', 400)
            }
            const {email} = jwt.verify(verification_email_token, ENVIRONMENT.JWT_SECRET_KEY)
            const user_found = await userRepository.buscarUnoPorEmail(email)
            
            if(!user_found){
                throw new ServerError('No existe un usuario con ese email, vuelve a registrarte', 404)
            }

            if(user_found.email_verified){
                throw new ServerError('Usuario ya verificado', 400)
            }

            await userRepository.actualizarPorid(
                user_found._id,
                {
                    email_verified: true,
                }
            )
            /* return response.json({
                message: 'Usuario verificado',
                ok: true,
                status: 200,
                data: null
            }) */
            return response.redirect(
                ENVIRONMENT.URL_FRONTEND + '/login?from=email-validated'
            )
        }

        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return response.json({
                    message: 'No autorizado',
                    ok: false,
                    status: 401,
                    data: null
                })
            }

            if (error.status) {
                return response.json({
                    message: error.message,
                    ok: false,
                    status: error.status,
                    data: null
                })
            }

            return response.json({
                message: 'Error interno del servidor',
                ok: false,
                status: 500,
                data: null
            })
        }
    }
}


const authController = new AuthController()
export default authController