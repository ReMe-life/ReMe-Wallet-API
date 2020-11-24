import { UserGameRewards } from '../database/repositories'

export class GameRewardsService {

    static async addUserReward (reward: any): Promise<void> {
        const userRewards = await UserGameRewards.getByEmail(reward.email)
        if (userRewards) {
            const document = { email: reward.emaik, rewards: [reward.rewardAmount] }
            return UserGameRewards.create(document);
        }

        userRewards.rewards.push(reward.rewardAmount)
        return UserGameRewards.update(userRewards)
    }

    // Todo: Implement it
    // Todo: Calculate the total amount of rewards
    static async getTotalRewardAmountByUser (email: string): Promise<any> {
        const userRewards = await UserGameRewards.getByEmail(email)
        if (userRewards) {
            ETHService.getAllMintedTokens

        }
        /* 6 hours / 24 hours
        // Todo: Get from the contract how much has been claimed?
            [
                {amount: 1, duration: today}
                {amount: 2, duration: today}

                {amount: 1, duration: today + 1}
                {amount: 2, duration: today + 1}
            ]
        */
    }
}
