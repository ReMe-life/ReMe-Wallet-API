import { TokenAuth } from '../middleware/auth'
import { UserController } from '../controllers'

export const userRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.get('/', TokenAuth.auth, UserController.getDetails)

    return router
}
