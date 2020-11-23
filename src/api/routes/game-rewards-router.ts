import GameRewardsController from '../controllers/game-rewards.controller'
import { GameAPIAuth, TokenAuth } from '../middleware/auth/'

export const gameRewardsRoutes = (expressApp: any) => {
    const router = expressApp.Router()

    router.post('/', GameAPIAuth.auth, GameRewardsController.upload)
    router.get('/:email', TokenAuth.auth, GameRewardsController.getByUser)

    return router
}
