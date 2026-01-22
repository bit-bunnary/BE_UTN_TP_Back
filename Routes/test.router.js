import express, { request, response } from 'express'
import testController from '../Controllers/test.controller.js'
import authMiddleware from '../Middlewares/authMiddleware.js'

const testRouter = express.Router()

testRouter.get(
    '/',
    testController.get
)

testRouter.get(
    '/authorized-test',
    authMiddleware,
    (request, response) => {
        console.log({user_data: request.user})
        return response.json({
            message: 'Test Correcto! O(∩_∩)O',
            ok: true,
            status: 200,
            data: null
        })
    }
)

export default testRouter