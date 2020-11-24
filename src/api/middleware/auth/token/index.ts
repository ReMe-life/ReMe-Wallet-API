import { Request, Response, NextFunction } from 'express'

import { ReMeApi } from '../../../../external-apis'
import { getLoggerFor } from '../../../../services/logger'
const logger = getLoggerFor('TokenAuth')

export class TokenAuth {

    public static async auth (req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.get('Authorization')
        const token = authHeader ? authHeader.substring(7) : null

        try {
            const validToken = await ReMeApi.validateToken(token)
            if (validToken) {
                res.locals.token = token
                return next()
            }

            throw new Error('Invalid token')
        } catch (error) {
            logger.error(`Authorization has failed with error: ${error.message}`)
            res.status(401).send({ message: 'Not authorized' })
        }
    }

}
