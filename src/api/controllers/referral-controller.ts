import { Request, Response } from 'express'
import { Input, Templates } from '../../models'
import { RRPApi } from '../../external-apis'

class ReferralController {

    public createUser = async (req: Request, res: Response): Promise<void> => {
        const userData = Input.parseRequire(req.body, Templates.RRP.User)
        await RRPApi.createUser(res.locals.token, userData)

        res.status(200)
    }

    public getReferralAmount = async (req: Request, res: Response): Promise<void> => {
        const referralAmount = await RRPApi.getReferralBalance(res.locals.token, req.params.userAddress)
        res.json({ referralAmount })
    }

    public getReferralLink = async (req: Request, res: Response): Promise<void> => {
        const referralLink = await RRPApi.getReferralLink(res.locals.token, req.params.userAddress)
        res.json({ referralLink })
    }

}

export default new ReferralController()
