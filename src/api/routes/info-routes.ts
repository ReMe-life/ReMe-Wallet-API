import { InfoController } from '../controllers'

export const infoRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.get('/status', InfoController.ping)

    return router
}
