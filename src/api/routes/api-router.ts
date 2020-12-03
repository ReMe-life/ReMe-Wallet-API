import * as express from 'express'

import { infoRoutes } from './info-routes'
import { authRoutes } from './auth-routes'
import { userRoutes } from './user-routes'
import { distributionRoutes } from './distribution-routes'

export const registerApiRoutes = (app: any) => {
    const basePrefix = process.env.API_BASE_PREFIX || ''

    app.use(`${basePrefix}/api/info`, infoRoutes(express))
    app.use(`${basePrefix}/api/auth`, authRoutes(express))
    app.use(`${basePrefix}/api/user`, userRoutes(express))
    app.use(`${basePrefix}/api/distribution`, distributionRoutes(express))
}
