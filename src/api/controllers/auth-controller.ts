import { Request, Response } from 'express'

import { Input, Templates } from '../../models'

import { ReMeApi } from '../../external-apis'
import { UserService, CryptoService } from '../../services'
import { ExpectableError, InternalError } from '../../exception'

import { getLoggerFor } from '../../services/logger'

class AuthController {

    private logger = getLoggerFor(this.constructor.name)

    public register = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.Standard)

        try {
            const token = await ReMeApi.login(regData.email, regData.password)
            const encToken = CryptoService.encrypt(token)
            await UserService.register(token, regData)

            res.send({ token, encToken })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new ExpectableError('Registered failed')
        }
    }

    public registerByReferral = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.ByReferral)

        try {
            const token = await ReMeApi.register(regData)
            const encToken = CryptoService.encrypt(token)
            await UserService.register(token, regData)


            res.send({ token, encToken })
        } catch (error) {
            this.logger.error(JSON.stringify(error))

            if (error.message.code === 409) {
                throw new ExpectableError('Existing account uses this email address. Please login or try a different email address.')
            }

            throw new ExpectableError('Referral registration failed')
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = Input.parseRequire(req.body, Templates.User.Login)

        try {
            const token = await ReMeApi.login(email, password)
            const userExists = await UserService.doesExist(email)

            if (userExists) {
                const encToken = CryptoService.encrypt(token)
                // @ts-ignore
                return res.send({ token, encToken })
            }

            res.send({ token: undefined, encToken: undefined })
        } catch (error) {
            this.logger.error(error)
            throw new InternalError('User does not have registration')
        }
    }

}

export default new AuthController()
