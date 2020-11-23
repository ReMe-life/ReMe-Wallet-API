import { TokenAuthorization } from './token-auth'

export class AdminAuthorization extends TokenAuthorization {

    protected async getAuthorizer (token: string): Promise<any> {
        return ''
    }

}
