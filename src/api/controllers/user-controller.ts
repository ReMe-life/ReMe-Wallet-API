import { Request, Response } from 'express'

import { ReMeApi, RRPApi } from '../../external-apis'
import { DistributionService } from '../../services'
import { Users } from '../../database/repositories'

class UsersController {

    public getDetails = async (req: Request, res: Response): Promise<void> => {
        const remeUser = await ReMeApi.getUser(res.locals.token, res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)

        const totalClaimed = await DistributionService.getTotalClaimed(user.ethAddress)
        const tokensForClaiming = user.loadedTokens - totalClaimed

        const rrpBalance = await RRPApi.getReferralBalance(res.locals.token, user.ethAddress)
        const incomingTokens = (rrpBalance + user.signupTokens) - user.loadedTokens

        res.send({
            email: user.email,
            referralLink: user.referralLink,
            wallet: {
                json: user.wallet,
                address: user.ethAddress
            },
            earnedTokens: {
                signup: user.signupTokens,
                referral: rrpBalance
            },
            incomingTokens,
            tokensForClaiming
        })
    }

}

export default new UsersController()
