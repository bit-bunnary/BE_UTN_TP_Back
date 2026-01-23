import express from "express"
import workspaceController from "../Controllers/workspace.controller.js"
import authMiddleware from "../Middlewares/authMiddleware.js"

const workspaceRouter = express.Router()

workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)
workspaceRouter.post('/', authMiddleware, workspaceController.create)
workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)

export default workspaceRouter
