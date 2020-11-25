import { TokenAuth } from '../middleware/auth'
import { ReferralController } from '../controllers'

export const referralRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.get('/:user/link', TokenAuth.auth, ReferralController.getReferralLink)
    router.get('/:user/amount', TokenAuth.auth, ReferralController.getReferralAmount)

    return router
}
