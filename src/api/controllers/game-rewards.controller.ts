import { Request, Response } from 'express'

import { Input, Templates } from '../../models'
import { GameRewardsService } from '../../services'

class GameRewardsController {

    public upload = async (req: Request, res: Response): Promise<void> => {
        const reward = Input.parseRequire(req.body, Templates.Rewards.Upload)
        // reward.lockDuration = Date.now() + process.env.lockPeriod

        await GameRewardsService.addUserReward(reward)

        res.status(200)
    }

    public getByUser = async (req: Request, res: Response): Promise<void> => {
        const userTotalRewards = await GameRewardsService.getByUser(req.params.email)
        res.send(userTotalRewards)
    }
}

export default new GameRewardsController()
