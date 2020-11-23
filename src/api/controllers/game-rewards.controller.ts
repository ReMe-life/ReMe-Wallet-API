import { Request, Response } from 'express'

import { Input, Templates } from '../../models'
import { UserGameRewards } from '../../database/repositories'

class GameRewardsController {

    public upload = async (req: Request, res: Response): Promise<void> => {
        const reward = Input.parseRequire(req.body, Templates.Rewards.Upload)
        // Todo: Add reward as a new entity in the rewards array
        reward.lockDuration = Date.now() + process.env.lockPeriod
        await UserGameRewards.upsert(reward)

        res.status(200)
    }

    public getByUser = async (req: Request, res: Response): Promise<void> => {
        // Todo: Calculate the total amount of rewards
        const userReward = await UserGameRewards.getByEmail(req.query.email,)
        res.send(userReward)
    }
}

export default new GameRewardsController()
