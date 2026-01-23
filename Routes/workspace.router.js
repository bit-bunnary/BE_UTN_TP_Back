import express from "express"
import workspaceController from "../Controllers/workspace.controller.js"
import authMiddleware from "../Middlewares/authMiddleware.js"

const workspaceRouter = express.Router()

workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)


export default workspaceRouter
