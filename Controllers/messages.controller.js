import { request, response } from "express"
import messagesRepository from "../Repositories/messages.repository.js"

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
}

const messagesController = new MessagesController()
export default messagesController