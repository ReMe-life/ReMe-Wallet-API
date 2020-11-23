import { AdminAuthorization } from './admin'
import { ClientAuthorization } from './client'

export const TokenAuth = {
    Admin: new AdminAuthorization().authorize,
    Client: new ClientAuthorization().authorize
}
