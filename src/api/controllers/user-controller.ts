import { Request, Response } from 'express'
import { BigNumber } from 'ethers'

import { ReMeApi, RRPApi } from '../../external-apis'
import { DistributionService } from '../../services'
import { Users } from '../../database/repositories'

class UsersController {

    public getDetails = async (req: Request, res: Response): Promise<void> => {
        const remeUser = await ReMeApi.getUser(res.locals.token, res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)

        const loadedTokens = BigNumber.from(user.loadedTokens)
        const totalClaimed = await DistributionService.getTotalClaimed(user.ethAddress)
        const tokensForClaiming = loadedTokens.sub(totalClaimed)

        const rrpBalance = BigNumber.from(await RRPApi.getReferralBalance(res.locals.token, user.ethAddress))
        const incomingTokens = rrpBalance.add(BigNumber.from(user.signupTokens)).sub(loadedTokens)

        res.send({
            email: user.email,
            referralLink: user.referralLink,
            wallet: {
                json: user.wallet,
                address: user.ethAddress
            },
            earnedTokens: {
                signup: user.signupTokens,
                referral: rrpBalance.toString()
            },
            incomingTokens: incomingTokens.toString(),
            tokensForClaiming: tokensForClaiming.toString()
        })
    }

}

export default new UsersController()
