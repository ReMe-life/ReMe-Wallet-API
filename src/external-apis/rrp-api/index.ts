import { BigNumber } from 'ethers'
import { HTTPRequester } from '../http-requester'
import { InternalError } from '../../exception'

const ONE_TOKEN = '1000000000000000000'

export class RRPApi {

    public static async createUser (user: any): Promise<any> {

        try {
            const result = await HTTPRequester.post(
                `${process.env.RRP_ENDPOINT}/addWithReferral`,
                { uid: user.address, referred_by: user.referredBy }
            )

            return result

        } catch (error) {
            throw new InternalError(
                `Creation of a user in RRP has failed: ${JSON.stringify(error)}`
            )
        }
    }

    public static async getReferralBalance (encToken: string, userAddress: string): Promise<any> {
        try {
            console.log(`${process.env.RRP_ENDPOINT}` + '/getMyBalance/' + `${userAddress}`)
            const result = await HTTPRequester.get(
                `${process.env.RRP_ENDPOINT}/getMyBalance/${userAddress}`,
                { Authorization: `${encToken}` }
            )

            return BigNumber.from(result.data.balance).mul(ONE_TOKEN).toString()
            // return BigNumber.from(1).mul(ONE_TOKEN).toString()
        } catch (error) {

            throw new InternalError(
                `Retrieving of referral amount for user[${userAddress}] has failed: ${JSON.stringify(error)}`
            )
        }
    }

    public static async getReferralLink (userAddress: string): Promise<any> {
        try {
            const result = await HTTPRequester.get(
                `${process.env.RRP_ENDPOINT}/getReferralCode/${userAddress}`
            )

            return result.data.referral_code
        } catch (error) {

            throw new InternalError(
                `Retrieving of referral link for user[${userAddress}] has failed: ${JSON.stringify(error)}`
            )
        }
    }

}
