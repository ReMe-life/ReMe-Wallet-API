import { Users } from '../../database/repositories'
import { RRPApi } from '../../external-apis'

export class UserService {

    public static async register (encToken: string, userDetails: any): Promise<void> {
        console.log("In user-service register line 7")
        await RRPApi.createUser({ address: userDetails.wallet.address, referredBy: userDetails.referredBy })
        console.log("In user-service register line 9")
        const rrpBalance = await RRPApi.getReferralBalance(encToken, userDetails.wallet.address)
        console.log("In user-service register line 11")
        console.log("next line af 11", rrpBalance)
        const referralLink = await RRPApi.getReferralLink(userDetails.wallet.address)
        console.log("In user-service register line 13")

        await Users.create({
            email: userDetails.email,
            ethAddress: userDetails.wallet.address,
            wallet: userDetails.wallet.json,
            signupTokens: process.env.SIGN_UP_REWARD,
            referralLink,
            rrpBalance,
            loadedTokens: 0
        })


    }

    public static async doesExist (email: string): Promise<boolean> {
        return !!(await Users.getByEmail(email))
    }

}
