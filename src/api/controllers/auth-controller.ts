import { Request, Response } from 'express'

import { Input, Templates } from '../../models'

import { ReMeApi } from '../../external-apis'
import { UserService } from '../../services'
import { ExpectableError, InternalError } from '../../exception'

import { getLoggerFor } from '../../services/logger'

class AuthController {

    private logger = getLoggerFor(this.constructor.name)

    public register = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.Standard)

        try {
            const token = await ReMeApi.login(regData.email, regData.password)
            await UserService.register(token, regData)

            res.send({ token })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new ExpectableError('Registered failed')
        }
    }

    public registerByReferral = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.ByReferral)

        try {
            const token = await ReMeApi.register(regData)
            await UserService.register(token, regData)

            res.send({ token })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new ExpectableError('Referral registration failed')
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = Input.parseRequire(req.body, Templates.User.Login)

        try {
            const token = await ReMeApi.login(email, password)
            const userExists = await UserService.doesExist(email)

            if (userExists) {
                // @ts-ignore
                return res.send({ token })
            }

            res.send({ token: undefined })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            throw new InternalError('User does not have registration')
        }
    }

}

export default new AuthController()
