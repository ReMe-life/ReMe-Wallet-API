export interface HTTPError {
    message: string;
    statusCode: number;
}

import { getLoggerFor } from '../services/logger'

export abstract class APIError extends Error {

    private logger = getLoggerFor(this.constructor.name)

    public statusCode: number;

    public readonly logMessage: string;
    public readonly isAPIOne: boolean = true;

    public constructor (error: HTTPError, logMessage?: string) {
        super(error.message)

        this.logMessage = logMessage
        this.statusCode = error.statusCode
    }

    public logError () {
        if (this.logMessage) {
            this.logger.error(this.logMessage)
        }
    }

}
