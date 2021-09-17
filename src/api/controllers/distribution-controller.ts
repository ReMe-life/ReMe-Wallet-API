import { BigNumber } from 'ethers'
import { Request, Response } from 'express'

import { Users, Distributions } from '../../database/repositories'
import { DistributionService } from '../../services'
import { ReMeApi, DistributionApi } from '../../external-apis'

class DistributionController {

    public distribute = async (req: Request, res: Response): Promise<void> => {
        // @ts-ignore
        const distribution = { users: [] }
        const allUsers = await Users.all()

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]
            if (user.rrpBalance) {
                const rrpBalance = BigNumber.from(user.rrpBalance)

                const loadedTokens = BigNumber.from(user.loadedTokens)
                //const tokensForClaiming = rrpBalance.add(BigNumber.from(user.signupTokens)).sub(loadedTokens)
                const tokensForClaiming = rrpBalance.sub(loadedTokens)

                if (!tokensForClaiming.eq('0')) {
                    const totalDistributedTokens = loadedTokens.add(tokensForClaiming).toString()
                    user.distributionIndex = await DistributionApi.addMoreTokens(user.ethAddress, totalDistributedTokens)
                    user.loadedTokens = totalDistributedTokens
                    await Users.update(user)

                    distribution.users.push({ email: user.email, claimAmount: tokensForClaiming.toString() })
                }
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
