import { Request, Response } from 'express'

import { Users } from '../../database/repositories'
import { DistributionService } from '../../services'
import { RRPApi, ReMeApi, DistributionApi } from '../../external-apis'


class DistributionController {

    public distribute = async (req: Request, res: Response): Promise<void> => {
        const allUsers = await Users.all()

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]
            const rrpBalance = await RRPApi.getReferralBalance('token', user.ethAddress)
            const tokensForClaiming = (rrpBalance + user.signupTokens) - user.loadedTokens

            user.distributionIndex = await DistributionApi.addMoreTokens(user.ethAddress, tokensForClaiming)
            user.loadedTokens += tokensForClaiming
            await Users.update(user)
        }

        const distributionHash = await DistributionApi.getRootHash()
        await DistributionService.updateRootHash(distributionHash)

        res.status(200)
    }

    public getClaimData = async (req: Request, res: Response): Promise<void> => {
        const remeUser = await ReMeApi.getUser(res.locals.token, res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)

        const proof = await DistributionApi.getProof(user.distributionIndex)
        res.send({
            proof,
            distributionIndex: user.distributionIndex
        })
    }
}

export default new DistributionController()
