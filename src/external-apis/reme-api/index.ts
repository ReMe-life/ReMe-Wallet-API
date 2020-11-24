import { HTTPRequester } from '../http-requester'
import { ExpectableError } from '../../exception'

export class ReMeAPI {

    public static async verifyToken (token: string): Promise<any> {
        try {
            const result = await HTTPRequester.post(
                `${process.env.REME_ENDPOINT}/token/verify`,
                { data: token },
                { Authorization: `Bearer ${token}` }
            )

            return result
        } catch (error) {
            throw new ExpectableError(`ReMe Token Verification: ${JSON.stringify(error)}`)
        }
    }
}
