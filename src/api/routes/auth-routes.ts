import { AuthController } from '../controllers'

export const authRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/register', AuthController.register)
    router.post('/register/referral', AuthController.registerByReferral)

    router.post('/login', AuthController.login)

    router.post('/reset', AuthController.reset)
    router.post('/reset/confirm', AuthController.confirmReset)

    return router
}
