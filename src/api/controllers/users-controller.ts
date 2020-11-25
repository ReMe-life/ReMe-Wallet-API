import { Request, Response } from 'express'

import { Users } from '../../database/repositories'

class UsersController {

    public getInformation = async (req: Request, res: Response): Promise<void> => {
        const user = await Users.getByEmail(req.params.email)

        res.send({
            ethAddress: user.ethAddress,
            wallet: user.wallet
        })
    }

}

export default new UsersController()
