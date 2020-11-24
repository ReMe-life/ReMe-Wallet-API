import { Request, Response, NextFunction } from 'express'

import { getLoggerFor } from '../../../services/logger'
import { ReMeAPI } from '../../../../external-apis'

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
            await this.getAuthorizer(token)
            res.locals.authorization = token

            return next()
        } catch (error) {
            this.logger.error(`Authorization has failed with error: ${error.message}`)
            res.status(401).send({ message: 'Not authorized' })
        }
    }

    private async getAuthorizer (token: string): Promise<any> {
        return ReMeAPI.verifyToken(token)
    }

}

export default new TokenAuth()
