import { Request, Response } from 'express'

import { ReMeApi, RRPApi } from '../../external-apis'
import { Users } from '../../database/repositories'

class UsersController {

    public getDetails = async (req: Request, res: Response): Promise<void> => {
        const remeUser = await ReMeApi.getUser(res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)
        const referralBalance = await RRPApi.getReferralBalance(res.locals.token, user.ethAddress)

        res.send({
            email: user.email,
            referralLink: user.referralLink,
            wallet: {
                json: user.wallet,
                address: user.ethAddress
            },
            earnedTokens: {
                signup: user.signupTokens,
                referral: referralBalance
            }
        })
    }

}

export default new UsersController()
