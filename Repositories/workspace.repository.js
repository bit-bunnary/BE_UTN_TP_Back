import MemberWorkspace from "../Models/MemberWorkspace.model.js";
import Workspace from "../Models/Workspace.model.js";

class WorkspaceRepository {
    async getWorkspacesByUserId (user_id){
        const workspaces = await MemberWorkspace.find({fk_id_user: user_id})
        .populate('fk_id_workspace')/* esto permite expandir sobre la referencia a Workspace */
        
        return workspaces
    }
    async create (fk_id_owner, title, image, description){
        const workspace = await Workspace.create({
            fk_id_owner,
            title,
            image,
            description,
        })
        return workspace
    }
    async addMember(workspace_id, user_id, role) {
        
        const member = await MemberWorkspace.create({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id,
            role
        })
        return member
    }

}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository