import express from "express"
import workspaceController from "../Controllers/workspace.controller.js"
import authMiddleware from "../Middlewares/authMiddleware.js"
import workspaceMiddleware from "../Middlewares/workspace.middleware.js"
import { channelController } from "../Controllers/channel.controller.js"
import channelMiddleware from "../Middlewares/channel.middleware.js"
import messagesController from "../Controllers/messages.controller.js"

const workspaceRouter = express.Router()

workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)
workspaceRouter.post('/', authMiddleware, workspaceController.create)

workspaceRouter.get('/:workspace_id', authMiddleware, workspaceMiddleware(), workspaceController.getById)
workspaceRouter.post('/:workspace_id/channels', authMiddleware, workspaceMiddleware(['Owner', 'Admin']), channelController.create)
workspaceRouter.get('/:workspace_id/channels', authMiddleware, workspaceMiddleware(), channelController.getAllByWorkspaceId)

/* 29.01.26 */
workspaceRouter.post('/:workspace_id/channels/:channel_id/messages', authMiddleware, workspaceMiddleware(), channelMiddleware, messagesController.create)

workspaceRouter.get('/:workspace_id/channels/:channel_id/messages', authMiddleware, workspaceMiddleware(), channelMiddleware, messagesController.getByChannelId)


workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)
workspaceRouter.post('/:workspace_id/members', authMiddleware, workspaceMiddleware(['Owner', 'Admin']), workspaceController.addMemberRequest)
workspaceRouter.get('/:workspace_id/members/accept-invitation', workspaceController.acceptInvitation)

/* Extras ↓↓↓ */

workspaceRouter.delete('/:workspace_id/channels/:channel_id/messages/:message_id', authMiddleware, workspaceMiddleware(), channelMiddleware, messagesController.delete)


export default workspaceRouter
