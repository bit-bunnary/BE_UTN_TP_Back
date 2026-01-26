import ServerError from "../Helpers/error.helpers";
import workspaceRepository from "../Repositories/workspace.repository"

async function workspaceMiddleware(authorized_roles = []) {
    return function (request, response, next) {
        try {
            const user_id = request.user.user_id
            const workspace_id = request.params.workspace_id

            const workspace_selected = workspaceRepository.getById(workspace_id)

            if (!workspace_selected) {
                throw new ServerError('No existe ese espacio de trabajo', 404)
            }

            /* obtiene la membresía */
            const member_selected = workspaceRepository.getMemberByWorkspaceIdAndUserId(workspace_id, user_id)

            if (!member_selected) {
                throw new ServerError('No perteneces a este espacio de trabajo', 403)
            }

            /* chequear el rol y gestiona el acceso por rol */
            if (authorized_roles.length > 0 && authorized_roles.includes(member_selected.role)) {
                throw new ServerError("No estas autorizado para hacer esta operación", 403);
            }

            /* el espacio de trabajo que selecciona y el tipo de rol que tiene para realizar la operación */
            request.workspace = workspace_selected
            request.memeber = member_selected
            next()
        } 
        
        catch (error) {
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
}

export default workspaceMiddleware