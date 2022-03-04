import { Request, Response, NextFunction } from 'express'

import { ReMeApi } from '../../../../external-apis'
import { CryptoService } from '../../../../services'

import { getLoggerFor } from '../../../../services/logger'
import { DistributionController } from '../../../controllers'

const logger = getLoggerFor('TokenAuth')

export class TokenAuth {

    public static async auth (req: Request, res: Response, next: NextFunction): Promise<void> {
        const authHeader = req.get('Authorization')
        const token = authHeader ? authHeader.substring(7) : null

        console.log('tokenAuth line 15 -- ', token)

        try {
            const tokenData = await ReMeApi.validateToken(token)
            if (tokenData) {
                res.locals.token = token
                res.locals.tokenInfo = tokenData
                res.locals.encToken = CryptoService.encryptText(token)

                // TODO: bypass of distribution bug
                DistributionController.distribute(null, null)

                return next()
            }

            throw new Error('Invalid token')
        } catch (error) {
            logger.error(`Authorization has failed with error in wallet api: ${error.message}`)
            res.status(401).send({ message: 'Not authorized' })
        }
    }

}
