import { Request, Response, NextFunction } from 'express'
import { token } from 'morgan'

import { getLoggerFor } from '../../../services/logger'

class TokenAuth {

    static instance: TokenAuth
    private logger = getLoggerFor(this.constructor.name)

    public constructor () {
        if (!TokenAuth.instance) {
            this.auth = this.auth.bind(this)
            TokenAuth.instance = this
        }

        return TokenAuth.instance
    }

    public async auth (req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.get('Authorization')
        const token = authHeader ? authHeader.substring(7) : null

        try {
            const authorizer = await this.getAuthorizer(token)
            req.headers.authorization = token
            res.locals.client = authorizer

            return next()
        } catch (error) {
            this.logger.error(`Authorization has failed with error: ${error.message}`)
            res.status(401).send({ message: 'Not authorized' })
        }
    }

    private async getAuthorizer (token: string): Promise<any> {

    }

}

export default new TokenAuth()
