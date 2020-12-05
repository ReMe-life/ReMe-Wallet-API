import { BigNumber } from 'ethers'
import { Request, Response } from 'express'

import { Users, Distributions } from '../../database/repositories'
import { DistributionService } from '../../services'
import { RRPApi, ReMeApi, DistributionApi } from '../../external-apis'

class DistributionController {

    public distribute = async (req: Request, res: Response): Promise<void> => {
        // @ts-ignore
        const distribution = { users: [] }
        const allUsers = await Users.all()

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]

            const loadedTokens = BigNumber.from(user.loadedTokens)
            const rrpBalance = BigNumber.from(await RRPApi.getReferralBalance('token', user.ethAddress))
            const tokensForClaiming = rrpBalance.add(BigNumber.from(user.signupTokens)).sub(loadedTokens)

            if (!tokensForClaiming.eq('0')) {
                user.distributionIndex = await DistributionApi.addMoreTokens(user.ethAddress, tokensForClaiming.toString())
                user.loadedTokens = loadedTokens.add(tokensForClaiming).toString()
                await Users.update(user)

                distribution.users.push({ email: user.email, claimAmount: tokensForClaiming.toString() })
            }
        }

        const distributionHash = await DistributionApi.getRootHash()
        await DistributionService.updateRootHash(distributionHash)
        await Distributions.create(distribution)

        res.send()
    }

    public getClaimData = async (req: Request, res: Response): Promise<void> => {
        const remeUser = await ReMeApi.getUser(res.locals.token, res.locals.tokenInfo.id)
        const user = await Users.getByEmail(remeUser.username)

        const proof = await DistributionApi.getProof(user.distributionIndex)
        res.send({
            proof,
            distributedTokens: user.loadedTokens,
            distributionIndex: user.distributionIndex
        })
    }

}

export default new DistributionController()
