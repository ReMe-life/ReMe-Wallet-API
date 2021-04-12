import { Users } from '../../database/repositories'
import { RRPApi } from '../../external-apis'

export class UserService {

    public static async register (userDetails: any): Promise<void> {
        await RRPApi.createUser({ address: userDetails.wallet.address, referredBy: userDetails.referredBy })
        const referralLink = await RRPApi.getReferralLink(userDetails.wallet.address)

        await Users.create({
            email: userDetails.email,
            ethAddress: userDetails.wallet.address,
            wallet: userDetails.wallet.json,
            signupTokens: process.env.SIGN_UP_REWARD,
            referralLink,
            loadedTokens: 0
        })
    }

    public static async doesExist (email: string): Promise<boolean> {
        return !!(await Users.getByEmail(email))
    }

}
