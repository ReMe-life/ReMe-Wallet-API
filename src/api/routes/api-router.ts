import * as express from 'express'

import { infoRoutes } from './info-routes'
import { referralRoutes } from './referral-routes'

export const registerApiRoutes = (app: any) => {
    const basePrefix = process.env.API_BASE_PREFIX || ''

    app.use(`${basePrefix}/api/info`, infoRoutes(express))
    app.use(`${basePrefix}/api/rrp`, referralRoutes(express))
}
