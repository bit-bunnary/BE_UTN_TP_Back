import ServerError from "../Helpers/error.helpers.js";
import channelRepository from "../Repositories/channel.repository.js"

async function channelMiddleware (request, response, next){
    try {
        const {channel_id} = request.params

        const channel_selected = await channelRepository.getByIdAndWorkspaceId(channel_id, workspace)
        if(!channel_selected){
            throw new ServerError("Ese canal no existe", 404)
        }

        request.channel = channel_selected
        next()

    } catch (error) {
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

export default channelMiddleware