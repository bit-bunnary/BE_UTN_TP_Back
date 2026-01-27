import express from "express"
import workspaceController from "../Controllers/workspace.controller.js"
import authMiddleware from "../Middlewares/authMiddleware.js"
import workspaceMiddleware from "../Middlewares/workspace.middleware.js"

const workspaceRouter = express.Router()

workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)
workspaceRouter.post('/', authMiddleware, workspaceController.create)

workspaceRouter.get('/:workspace_id', authMiddleware, workspaceMiddleware(), workspaceController.getById)
workspaceRouter.get('/:workspace_id/channels', authMiddleware, workspaceMiddleware(), workspaceController.getChannels)

workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)
workspaceRouter.post('/:workspace_id/members', authMiddleware, workspaceMiddleware(['owner', 'admin']), workspaceController.addMemberRequest)
workspaceRouter.get('/:workspace_id/members/accept-invitation', workspaceController.acceptInvitation)


export default workspaceRouter
