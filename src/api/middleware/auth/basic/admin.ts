import { Request, Response, NextFunction } from 'express'

import { getLoggerFor } from '../../../../services/logger'
const logger = getLoggerFor('AdminAuth')

class AdminAuth {

    public static instance: AdminAuth

    public constructor () {
        if (!AdminAuth.instance) {
            this.auth = this.auth.bind(this)
            this.parseBasicAuth = this.parseBasicAuth.bind(this)

            AdminAuth.instance = this
        }

        return AdminAuth.instance
    }

    public async auth (req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = this.parseBasicAuth(req.headers.authorization)
            if (credentials.email === process.env.ADMIN_EMAIL &&
                credentials.password === process.env.ADMIN_PASSWORD) {
                return next()
            }

            throw new Error('Unknown admin')
        } catch (error) {
            logger.error(`Authorization has failed with error: ${error.message}`)
            res.status(401).send({ message: 'Not authorized' })
        }
    }

    private parseBasicAuth (auth: string): any {
        if (!auth) {
            throw new Error('Credentials are not provided')
        }

        const authData = auth.split(/\s/)[1]
        const authBuffer = Buffer.from(authData, 'base64').toString()
        const credentials = authBuffer.split(':')

        return {
            email: credentials[0],
            password: credentials[1]
        }
    }
}

export default new AdminAuth()
