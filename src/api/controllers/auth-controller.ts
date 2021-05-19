import { Request, Response } from 'express'

import { Input, Templates } from '../../models'

import { Users } from '../../database/repositories'
import { ReMeApi, RRPApi } from '../../external-apis'
import { UserService, CryptoService } from '../../services'
import { ExpectableError, InternalError } from '../../exception'

import { getLoggerFor } from '../../services/logger'

class AuthController {

    private logger = getLoggerFor(this.constructor.name)

    public register = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.Standard)

        try {
            const token = await ReMeApi.login(regData.email, regData.password)
            const encToken = CryptoService.encryptData({ token, wallet: regData.wallet.address })

            await UserService.register(encToken, regData)

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
            const encToken = CryptoService.encryptData({ token, wallet: regData.wallet.address })

            await UserService.register(encToken, regData)

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
            const user = await Users.getByEmail(email)

            if (user.email) {

                const encToken = CryptoService.encryptData({ wallet: user.ethAddress, token })
                user.rrpBalance = await RRPApi.getReferralBalance(encToken, user.ethAddress)
                await Users.update(user)

                // @ts-ignore
                return res.send({ token, encToken })
            }

            res.send({ token: undefined, encToken: undefined })
        } catch (error) {
            this.logger.error(error)
            throw new InternalError('User does not have registration')
        }
    }

    public reset = async (req: Request, res: Response): Promise<void> => {
        const { email } = Input.parseRequire(req.body, Templates.User.Password.Reset)

        try {
            await ReMeApi.resetPassword(email)
            res.status(200).send()
        } catch (error) {
            this.logger.error(error)
            throw new InternalError(error.message)
        }
    }

    public confirmReset = async (req: Request, res: Response): Promise<void> => {
        const resetData = Input.parseRequire(req.body, Templates.User.Password.ConfirmReset)

        try {
            await ReMeApi.confirmReset(resetData)
            res.status(200).send()
        } catch (error) {
            this.logger.error(error)
            throw new InternalError(error.message)
        }
    }

}

export default new AuthController()
