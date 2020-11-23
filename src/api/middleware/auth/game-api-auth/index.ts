import { Request, Response, NextFunction } from 'express'

export class GameAPIAuth {

    public static async auth (req: Request, res: Response, next: NextFunction): Promise<void> {
        const apiKey = ''

        if (apiKey === process.env.GAME_API_KEY) {
            return next()
        }

        res.status(401).send({ message: 'Not authorized' })
    }

}
