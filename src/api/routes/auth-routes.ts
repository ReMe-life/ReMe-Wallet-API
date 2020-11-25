import { AuthController } from '../controllers'

export const authRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/register', AuthController.register)
    router.post('/login', AuthController.login)

    return router
}
