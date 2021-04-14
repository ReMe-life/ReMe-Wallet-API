import { Request, Response } from 'express'
import { BigNumber } from 'ethers'

import { Input, Templates } from '../../models'

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

        const rrpBalance = BigNumber.from(user.rrpBalance)
        const incomingTokens = rrpBalance.add(BigNumber.from(user.signupTokens)).sub(loadedTokens)

        res.send({
            email: user.email,
            referralLink: user.referralLink,
            wallet: {
                json: user.wallet,
                address: user.ethAddress
            },
            earnedTokens: {
                signup: totalClaimed.sub(user.signupTokens).gt('0') ? user.signupTokens : '0',
                referral: totalClaimed.sub(user.signupTokens).gt('0') ? totalClaimed.sub(user.signupTokens).toString() : '0'
            },
            signupTokens: user.signupTokens,
            incomingTokens: incomingTokens.toString(),
            tokensForClaiming: tokensForClaiming.toString()
        })
    }

    public saveRecoveredWallet = async (req: Request, res: Response): Promise<void> => {
        const newWallet = Input.parseRequire(req.body, Templates.User.Wallet.NewEncrypted)

        const remeUser = await ReMeApi.getUser(res.locals.token, res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)
        user.wallet = newWallet.wallet

        await Users.update(user)
        res.send()
    }

}

export default new UsersController()
