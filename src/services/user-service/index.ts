import { Users } from '../../database/repositories'
import { RRPApi } from '../../external-apis'

export class UserService {

    public static async register (encToken: string, userDetails: any): Promise<void> {
        console.log('Register from user-service ==>')
        await RRPApi.createUser({ address: userDetails.wallet.address, referredBy: userDetails.referredBy })
        const rrpBalance = await RRPApi.getReferralBalance(encToken, userDetails.wallet.address)
        console.log('before:user data collected from user-service.')
        const referralLink = await RRPApi.getReferralLink(userDetails.wallet.address)
        console.log('after:user data collected from user-service.')
        await Users.create({
            email: userDetails.email,
            ethAddress: userDetails.wallet.address,
            wallet: userDetails.wallet.json,
            signupTokens: process.env.SIGN_UP_REWARD,
            referralLink,
            rrpBalance,
            loadedTokens: 0
        })
        console.log('create:user data collected from user-service.')
    }

    public static async doesExist (email: string): Promise<boolean> {
        return !!(await Users.getByEmail(email))
    }

}
