import { BigNumber } from 'ethers'
import { Request, Response } from 'express'

import { Users, Distributions } from '../../database/repositories'
// import { DistributionService } from '../../services'
import { ReMeApi, DistributionApi } from '../../external-apis'

class DistributionController {

    public distribute = async (req: Request, res: Response): Promise<void> => {
        // @ts-ignore
        console.log('going to distribute')

        // @ts-ignore
        const distribution = { users: [] }
        const allUsers = await Users.all()

        //console.log(allUsers)

        for (let i = 0; i < allUsers.length; i++) {
            const user = allUsers[i]
            if (user.rrpBalance) {
                const rrpBalance = BigNumber.from(user.rrpBalance)

                const loadedTokens = BigNumber.from(user.loadedTokens)
                console.log('loaded token at new registration: ',loadedTokens)
                const tokensForClaiming = rrpBalance.add(BigNumber.from(0)).sub(loadedTokens)
                // const tokensForClaiming = rrpBalance.sub(BigNumber.from(user.signupTokens))
                //const tokensForClaiming = rrpBalance.sub(loadedTokens)

                console.log('token claiming', tokensForClaiming.toString())

                if (!tokensForClaiming.eq('0')) {
                    //
                    console.log("inside token Claiming")
                    console.log('token claiming in if', tokensForClaiming)
                    const totalDistributedTokens = loadedTokens.add(tokensForClaiming).toString()

                    // TODO: distribution tree link with reme.core which is not required now and server is not working
                    //user.distributionIndex = await DistributionApi.addMoreTokens(user.ethAddress, totalDistributedTokens)
                    user.distributionIndex = tokensForClaiming.toString()
                    user.loadedTokens = totalDistributedTokens
                    console.log('in console log tokenclaim', user)
                    await Users.update(user)
                    console.log("distribution: before", distribution)
                    distribution.users.push({ email: user.email, claimAmount: tokensForClaiming.toString() })
                    console.log("distribution: after", distribution)
                }else {
                    console.log('not in console.log')
                }
            }
        }

        // TODO: distribution tree link with reme.core which is not required now and server is not working
        //const distributionHash = await DistributionApi.getRootHash()
        ////await DistributionService.updateRootHash(distributionHash)
        console.log(distribution)
        await Distributions.create(distribution)

        res.send(200)
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
