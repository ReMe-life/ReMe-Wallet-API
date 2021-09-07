import { BigNumber } from 'ethers'
import { HTTPRequester } from '../http-requester'
import { InternalError } from '../../exception'


const ONE_TOKEN = '1000000000000000000'

export class RRPApi {

    public static async createUser (user: any): Promise<any> {
        console.log("In rrp-api create user line 10")
        console.log("uid")
        console.log(user.address)

        console.log("referedby")
        console.log(user.referredBy)
        try {

            const result = await HTTPRequester.post(
                `${process.env.RRP_ENDPOINT}/addWithReferral`,
                { uid: user.address, referred_by: user.referredBy },
            )

            console.log("In rrp-api create user line 17", result)

            return result
        } catch (error) {
            console.log("In rrp-api create user line 26", error.stack)
            throw new InternalError(
                `Creation of a user in RRP has failed: ${JSON.stringify(error)}`
            )
        }
    }

    public static async getReferralBalance (encToken: string, userAddress: string): Promise<any> {
        try {
            console.log("Enc token line 37")
            console.log(encToken)
            console.log("uuid token line 39")
            console.log(`${process.env.RRP_ENDPOINT}`+'/getMyBalance/'+`${userAddress}`)
            console.log("this is my token")
            const result = await HTTPRequester.get(
                `${process.env.RRP_ENDPOINT}/getMyBalance/${userAddress}`,
                { Authorization: `${encToken}` }
            )

            return BigNumber.from(result.data.balance).mul(ONE_TOKEN).toString()
            //return BigNumber.from(1).mul(ONE_TOKEN).toString()
        } catch (error) {
            console.log("In rrp-api create user line 44", error)
            console.log("In rrp-api create user line 45", error.message)

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
            console.log("In rrp-api create user line 60", error.stack)
            throw new InternalError(
                `Retrieving of referral link for user[${userAddress}] has failed: ${JSON.stringify(error)}`
            )
        }
    }

}
