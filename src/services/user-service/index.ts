import { Users } from '../../database/repositories'
import { RRPApi } from '../../external-apis'

export class UserService {

    public static async register (token: string, userDetails: any): Promise<void> {
        await Users.create({
            email: userDetails.email,
            ethAddress: userDetails.wallet.address,
            wallet: userDetails.wallet.json,
            tokens: process.env.SIGN_UP_REWARD
        })

        await RRPApi.createUser(token, { address: userDetails.wallet.address, referredBy: userDetails.referredBy })
    }

    public static async doesExist (email: string): Promise<boolean> {
        return !!(await Users.getByEmail(email))
    }
}
