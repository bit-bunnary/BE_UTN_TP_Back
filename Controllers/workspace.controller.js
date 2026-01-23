class WorkspaceController {
    async getWorkspaces(request, response) {
        /* obtengo espacios de trabajo asocioados a quién hace la consulta */
        console.log ("El usuario loggeado es:", request.user)

        response.json(
            {ok: true}
        )
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController