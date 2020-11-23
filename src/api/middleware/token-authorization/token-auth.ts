import { Request, Response, NextFunction } from 'express'

import { getLoggerFor } from '../../../services/logger'

export class TokenAuthorization {

    private logger = getLoggerFor(this.constructor.name)

    public constructor () {
        this.authorize = this.authorize.bind(this)
    }

    public async authorize (req: Request, res: Response, next: NextFunction): Promise<void> {
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

    protected async getAuthorizer (token: string): Promise<any> {

    }

}
