import { HTTPRequester } from '../http-requester'

export class ReMeApi {

    public static async register (user: any): Promise<any> {
        await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/register`,
            {
                firstname: user.firstName,
                lastname: user.lastName,
                password: user.password,
                username: user.email
            }
        )

        const token = await ReMeApi.login(user.email, user.password)
        return token
    }

    public static async login (email: string, password: string): Promise<any> {
        const result = await HTTPRequester.post(
            `${process.env.REME_CORE_ENDPOINT}/auth/login`,
            { username: email, password }
        )

        return result.jwt
    }

    public static async getUser (token: string, userId: string): Promise<any> {
        const result = await HTTPRequester.get(
            `${process.env.REME_CORE_ENDPOINT}/users/${userId}`,
            { Authorization: `Bearer ${token}` }
        )

        return result
    }

    public static async validateToken (token: string): Promise<boolean> {
        return true
    }

}
