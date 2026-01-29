import { connectMongoDB } from "./Config/mongoDB.config.js"
import express from 'express'
import authRouter from "./Routes/auth.router.js"
import cors from 'cors'
import workspaceRouter from "./Routes/workspace.router.js"
import workspaceRepository from "./Repositories/workspace.repository.js"
import messagesRepository from "./Repositories/messages.repository.js"

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


app.use('/api/auth', authRouter)
app.use("/api/workspace", workspaceRouter)

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

/* espacio de trabajo de prueba */

/* async function crearEspacioDeTrabajo() {
    //creo espacio de prueba
    const workspace = await workspaceRepository.create(
        '69718bb61191bb64fed1cb8a',
        'Test',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.DqHs53HmUgdzkassXPRnsQHaFj%3Fpid%3DApi&f=1&ipt=bea923cb68db5571bb50abe915e2ec3de38453d4db0da32a290e8d1b6a9c6181&ipo=images',
        'Desc. de Workspace'
    )
    //Me agrego como miembro
    await workspaceRepository.addMember(workspace._id, '69718bb61191bb64fed1cb8a', 'Owner')
}

crearEspacioDeTrabajo() */

/* messagesRepository.getAllByChannelId('697a5ab14d03ffb2fefc10fe').then(result => console.log(JSON.stringify(result))) */