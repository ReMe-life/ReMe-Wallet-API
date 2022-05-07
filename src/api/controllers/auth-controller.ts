import { Request, Response } from 'express'

import { Input, Templates } from '../../models'

import { Users } from '../../database/repositories'
import { ReMeApi, RRPApi } from '../../external-apis'
import { UserService, CryptoService } from '../../services'
import { ExpectableError, InternalError } from '../../exception'
import { DistributionController } from '../controllers'

import { getLoggerFor } from '../../services/logger'

class AuthController {

    private logger = getLoggerFor(this.constructor.name)

    public register = async (req: Request, res: Response): Promise<void> => {
        console.log('register req initate ==>')

        const regData = Input.parseRequire(req.body, Templates.User.Registration.Standard)

        try {
            console.log('try catch of RemeApi.loging ==>')
            // console.log('main function before login in auth line 23')
            this.logger.error('Logger here 24')
            const token = await ReMeApi.login(regData.email, regData.password)
            this.logger.error('token from register auth controller', token)
            // console.log('main function center from 27 auth')

            // this.logger.error('Logger here token 27')

            const encToken = CryptoService.encryptData({ token, wallet: regData.wallet.address })

            await UserService.register(encToken, regData)
            console.log('after registration')

            res.send({ token, encToken })
        } catch (error) {
            this.logger.error(JSON.stringify(error))
            this.logger.error(error.stack)
            throw new ExpectableError('Registered failed')
        }
    }

    public registerByReferral = async (req: Request, res: Response): Promise<void> => {
        const regData = Input.parseRequire(req.body, Templates.User.Registration.ByReferral)
        console.log('main function center')
        // this.logger.error('Logger here token 44')

        try {
            console.log('referral reg data ==>')
            // this.logger.error('Logger here token 48')
            const token = await ReMeApi.register(regData)
            // this.logger.info(token)
            console.log('token from reg==>', token)

            // this.logger.info('After register token here', token)
            // this.logger.error('goting to encryptdata')
            const encToken = CryptoService.encryptData({ token, wallet: regData.wallet.address })
            console.log('encToken ==>')
            console.log(encToken)
            // this.logger.error('Here is enctkeing')
            // this.logger.error(encToken)
            // this.logger.error('Logger here token 59')
            await UserService.register(encToken, regData)

            console.log('after registration')
            // this.logger.error('Before crash after register')
            res.send({ token, encToken })
        } catch (error) {
            // this.logger.error(JSON.stringify(error))
            if (error.message.code === 409) {
                // console.log('main function center')
                // this.logger.error('Logger here token in error 57')
                throw new ExpectableError('Existing account uses this email address. Please login or try a different email address.')
            }

            throw new ExpectableError('Referral registration failedd')
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = Input.parseRequire(req.body, Templates.User.Login)
        console.log('auth-controller in login...')

        try {
            // this.logger.error('Logger here by email')
            const token = await ReMeApi.login(email, password)
            const user = await Users.getByEmail(email)

            DistributionController.distribute(null, null)

            if (user.email) {
                const encToken = CryptoService.encryptData({ wallet: user.ethAddress, token })
                user.rrpBalance = await RRPApi.getReferralBalance(encToken, user.ethAddress)
                await Users.update(user)

                // @ts-ignore
                return res.send({ token, encToken })
            }

            res.send({ token: undefined, encToken: undefined })
        } catch (error) {
            this.logger.error('login', error)
            console.log(error.message)
            throw new InternalError('User does not have registration')
        }
    }

    public reset = async (req: Request, res: Response): Promise<void> => {
        const { email } = Input.parseRequire(req.body, Templates.User.Password.Reset)
        console.log('=======')
        console.log('Reset Password hit by API')
        console.log('=======')

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
