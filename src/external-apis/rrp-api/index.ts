import { HTTPRequester } from '../http-requester'
import { InternalError } from '../../exception'

export class RRPApi {

    public static async createUser (token: string, user: any): Promise<any> {
        try {
            const result = await HTTPRequester.post(
                `${process.env.RRP_ENDPOINT}/addWithReferral`,
                { uid: user.address, referred_by: user.referredBy },
                { Authorization: `Bearer ${token}` }
            )

            return result
        } catch (error) {
            throw new InternalError(
                `Creation of a user in RRP has failed: ${JSON.stringify(error)}`
            )
        }
    }

    public static async getReferralBalance (token: string, userAddress: string): Promise<any> {
        try {
            const result = await HTTPRequester.get(
                `${process.env.RRP_ENDPOINT}/getMyBalance/${userAddress}`,
                { Authorization: `Bearer ${token}` }
            )

            return result.data.balance
        } catch (error) {
            throw new InternalError(
                `Retrieving of referral amount for user[${userAddress}] has failed: ${JSON.stringify(error)}`
            )
        }
    }

    public static async getReferralLink (token: string, userAddress: string): Promise<any> {
        try {
            const result = await HTTPRequester.get(
                `${process.env.RRP_ENDPOINT}/getReferralCode/${userAddress}`,
                { Authorization: `Bearer ${token}` }
            )

            return result.data.referral_code
        } catch (error) {
            throw new InternalError(
                `Retrieving of referral link for user[${userAddress}] has failed: ${JSON.stringify(error)}`
            )
        }
    }

}
