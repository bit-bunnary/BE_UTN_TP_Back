import workspaceRepository from "../Repositories/workspace.repository.js"

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
            }
        )
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController