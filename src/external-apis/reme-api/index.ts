import { verify } from 'jsonwebtoken'
import { HTTPRequester } from '../http-requester'

export class ReMeApi {

    public static async register (user: any): Promise<any> {
        console.log('ReMeApi register req intiate from reme-api/index.ts ==>', process.env.REME_CORE_ENDPOINT)
        await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/register`,
            {
                firstname: user.firstName,
                lastname: user.lastName,
                password: user.password,
                username: user.email
            }
        )

        console.log('ReMeApi register req intiate from reme-api/index.ts ==> attempt to login')
        const token = await ReMeApi.login(user.email, user.password)

        return token
    }

    public static async login (email: string, password: string): Promise<any> {
        const result = await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/login`,
            { username: email, password }
        )

        console.log('ReMeApi register req intiate from reme-api/index.ts ==> return jwt', result.jwt)
        return result.jwt
    }

    public static async validateToken (token: string): Promise<boolean> {
        const result = await HTTPRequester.get(
            `${process.env.REME_CORE_ENDPOINT}/auth/verification_key`
        )

        return new Promise((resolve, reject) => {
            verify(token, result.public_key, (err: any, decoded: any) => {
                if (err) return reject(err)
                resolve(decoded)
            })
        })
    }

    public static async getUser (token: string, userId: string): Promise<any> {
        const result = await HTTPRequester.get(
            `${process.env.REME_CORE_ENDPOINT}/users/${userId}`,
            { Authorization: `Bearer ${token}` }
        )

        return result
    }

    public static async resetPassword (email: string): Promise<void> {
        await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/forgot`,
            { username: email }
        )
    }

    public static async confirmReset (resetData: any): Promise<void> {
        await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/confirm`,
            { ...resetData }
        )
    }

}
