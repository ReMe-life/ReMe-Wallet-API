import { APIError } from './api'

export class ExpectableError extends APIError {

    public constructor (logMessage: string) {
        super({ message: logMessage, statusCode: 400 })
    }

}
