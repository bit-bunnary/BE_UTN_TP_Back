import { request, response } from "express"
import messagesRepository from "../Repositories/messages.repository.js"
import ServerError from "../Helpers/error.helpers.js"

class MessagesController {
    async create (request, response){
        try {
            const {content} = request.body
            const member_id = request.member._id
            const {channel_id} = request.params
            await messagesRepository.create(member_id, content, channel_id)

            return response.json({
                message: 'Mensaje creado exitosamente',
                ok: true,
                status: 201
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

    async getByChannelId(request, response){
        try{
            const {channel_id} = request.params
            const messages = await messagesRepository.getAllByChannelId(channel_id)
            return response.json({
                message: 'Mensajes obtenidos exitosamente',
                ok: true,
                status: 201,
                data:{messages}
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

    /* extra */
    async delete (request, response){
        try {
            const {message_id} = request.params
            const member = request.member /* Miembro del Workspace */
            const message = await messagesRepository.getById(message_id)
            if(!message){
                throw new ServerError("El mensaje no existe", 404);
            }

            /* esto es si es el creador del msg */
            const isOwnerOfMessage = message.fk_workspace_member_id.toString() === member._id.toString()

            /* y este para ver si es Admin/Owner */
            const isAdminOrOwner = member.role === 'Admin' || member.role === 'Owner'

            if(!isOwnerOfMessage && !isAdminOrOwner){
                throw new ServerError("No tenés permisos para eliminar este mensaje", 403)
            }

            await messagesRepository.deleteById(message_id)
            return response.json({
                message: 'Mensaje eliminado correctamente',
                ok: true,
                status: 200
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

const messagesController = new MessagesController()
export default messagesController