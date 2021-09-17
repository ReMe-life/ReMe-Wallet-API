import { BasicAuth, TokenAuth } from '../middleware/auth'
import { DistributionController } from '../controllers'

export const distributionRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/', BasicAuth.AdminAuth.auth, DistributionController.distribute)
    //router.post('/', DistributionController.distribute)
    router.get('/', TokenAuth.auth, DistributionController.getClaimData)

    return router
}
