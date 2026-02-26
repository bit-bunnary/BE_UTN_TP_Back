import Mail from "nodemailer/lib/mailer/index.js"
import ENVIRONMENT from "../Config/environment.config.js"
import ServerError from "../Helpers/error.helpers.js"
import userRepository from "../Repositories/user.repository.js"
import workspaceRepository from "../Repositories/workspace.repository.js"
import jwt from 'jsonwebtoken'
import mailTransporter from "../Config/mail.config.js"
import channelRepository from "../Repositories/channel.repository.js"

class WorkspaceController {
    async getWorkspaces(request, response) {
        /* obtengo espacios de trabajo asocioados a quién hace la consulta */
        console.log ("El usuario loggeado es:", request.user)
        const user_id = request.user.id
        const workspaces =  await workspaceRepository.getWorkspacesByUserId(user_id)
        response.json({
            ok: true,
            data: {
                workspaces
            }
        })
    }

    async create(request, response){
        try {
            console.log("USER:", request.user)
            const { title, /* image ,*/ description } = request.body
            const user_id = request.user.id
            const workspace = await workspaceRepository.create(user_id, title, null, description)
            
            /* Agrega al owner */
            await workspaceRepository.addMember(workspace._id, user_id, 'Owner')


            /* Crear canal por default  */
            const defaultChannel = await channelRepository.create(
                workspace._id,
                'General'
            )

            response.json({
                ok: true,
                data: {
                    workspace,
                    defaultChannel
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

    /* sólo el owner va a poder eliminar el workspace */
    async delete(request, response) {
        try {
            const user_id = request.user.id
            const { workspace_id } = request.params

            const workspace_selected = await workspaceRepository.getById(workspace_id)
            if(!workspace_selected){
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }

            const member_info = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)
            /* si el rol es distinto de 'Owner */
            if (member_info.role !== 'Owner') {
                throw new ServerError('No tienes permiso para eliminar este espacio de trabajo', 403)
            }
            await workspaceRepository.delete(workspace_id)
            response.json({
                ok: true,
                message: 'Espacio de trabajo eliminado correctamente',
                status: 200,
                data: null
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

    async addMemberRequest(request, response){
        try {
            const {email, role} = request.body
            const workspace = request.workspace
            const user_to_invite = await userRepository.buscarUnoPorEmail(email)
            if(!user_to_invite){
                throw new ServerError("El email del invitado no existe", 404);
                
            }

            const already_member = await workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace._id, user_to_invite._id)



            if(already_member){
                throw new ServerError("El usuario ya es miembro de este espacio de trabajo", 400)
            }

            const token = jwt.sign(
                {
                    id: user_to_invite._id,
                    email,
                    workspace: workspace._id,
                    role
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                {
                    expiresIn: "1d"
                }
            )

            await mailTransporter.sendMail(
                {
                    to: email,
                    from: ENVIRONMENT.GMAIL_USER,
                    subject: `Invitación a ${workspace.title} 🖥️🌸`,
                    html: `
                        <h1>Has sido invitado a participar del espacio de trabajo: ${workspace.title} </h1>
                        <p>Si no reconoces esta invitación, desestima este mail</p>
                        <p>Haz click en aceptar invitación para unirte al espacio de trabajo</p>
                        <a href='${ENVIRONMENT.URL_BACKEND}/api/workspace/${workspace._id}/members/accept-invitation?invitation_token=${token}'>Aceptar Invitación</a>
                    `
                }
            )
            return response.json(
                {
                    message: 'Invitación enviada',
                    status: 201,
                    ok: true,
                    data: null
                }
            )
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
                message: 'Error interno del servidor 1',
                ok: false,
                status: 500,
                data: null
            })
        }
    }
    async acceptInvitation (request, response){
        try {
            const {invitation_token} = request.query
            const payload = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET_KEY)
            const {id, workspace: workspace_id, role} = payload
            console.log(invitation_token, payload)
            await workspaceRepository.addMember(workspace_id, id, role)

            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/`)
        }
        
        catch (error) {
            /* console.log({error}) */

            if (error.status) {
                return response.json({
                    message: error.message,
                    ok: false,
                    status: error.status,
                    data: null
                })
            }
            return response.json({
                message: 'Error interno del servidor 2',
                ok: false,
                status: 500,
                data: null
            })
        }
    }

    async getById (request, response){
        try {
            const {workspace, member} = request
            response.json({
                message: 'Espacio de trabajo seleccionado',
                ok: true,
                status: 200,
                data: {
                    workspace,
                    member
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
}


const workspaceController = new WorkspaceController()

export default workspaceController