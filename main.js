import { connectMongoDB } from "./Config/mongoDB.config.js"
import express from 'express'
import testRouter from "./Routes/test.router.js"
import authRouter from "./Routes/auth.router.js"
import mailTransporter from "./Config/mail.config.js"
import ENVIRONMENT from "./Config/environment.config.js"
import cors from 'cors'

connectMongoDB()


/* creamos servidor web (Express App) */
const app = express()

app.use(cors())

/* hebilita recibir .json por body */
app.use(express.json())


/* app.post(
    '/auth/register', async (request, response) => {
        const {username, email, password} = request.body
        await userRepository.crear({
            username,
            email,
            password
        })
        response.send('Usuario creado exitosamente! (￣▽￣)')
    }
) */


app.use('/api/test', testRouter)

app.use('/api/auth', authRouter)

app.listen(
    8180,
    () => {
        console.log('Listening app port 8180')
    }
)

/* mailTransporter.sendMail({
    from: ENVIRONMENT.GMAIL_USER,
    to: ENVIRONMENT.GMAIL_USER,
    subject: 'Hi! Im testing NodeMailer',
    html: `<h1>Probando NodeMailer</h1>`
}) */

