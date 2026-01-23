import MemberWorkspace from "../Models/MemberWorkspace.model.js";
import Workspace from "../Models/Workspace.model.js";

class WorkspaceRepository {

    async getById(workspace_id){
        return await Workspace.findById(workspace_id)
        
    }

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

    /* obtenemos miembro de workspace por el ID del espacio de trabajo y de usuario */
    async getMemberByWorkspaceIdAndUserId(workspace_id, user_id){
        const member = await MemberWorkspace.findOne({
            fk_id_workspace: workspace_id,
            fk_id_user: user_id
        })
        return member
    }

    async  delete(workspace_id){
        await Workspace.findByIdAndUpdate(workspace_id, {active: false})
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository