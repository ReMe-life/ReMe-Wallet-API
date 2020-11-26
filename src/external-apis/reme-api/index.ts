import { HTTPRequester } from '../http-requester'

export class ReMeApi {

    public static async register (user: any): Promise<any> {
        const result = await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/register`,
            {
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                username: user.email
            }
        )

        return result.jwt
    }

    public static async login (email: string, password: string): Promise<any> {
        const result = await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/login`,
            { username: email, password }
        )

        return result.jwt
    }

    public static async getUser (userId: string): Promise<any> {
        const result = await HTTPRequester.get(
            `${process.env.REME_CORE_ENDPOINT}/users/${userId}`
        )

        return result
    }

    public static async validateToken (token: string): Promise<boolean> {
        return true
    }

}
