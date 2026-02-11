import channelRepository from "../Repositories/channel.repository.js"

class ChannelController {
    async getAllByWorkspaceId(request, response){
        try {
            const { workspace_id } = request.params
            const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
            if (channels.length === 0) {
                response.json({
                    message: 'No hay canales',
                    ok: false,
                    status: 204,
                    data: null
                })
            }
            else {
                response.json({
                    message: 'Canales obtenidos exitosamente',
                    ok: true,
                    status: 200,
                    data: {
                        channels
                    }
                })
            }
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

    async create (request, response){
        try {
            const {name} = request.body
            const {workspace_id} = request.params
            /* TODO: Podrían validar el nombre */

            const channel_created =  await channelRepository.create(workspace_id, name)
            response.json({
                message: 'Canal creado correctamente',
                ok: true,
                status: 201,
                data: {channel_created}
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

const channelController = new ChannelController()
export {channelController}