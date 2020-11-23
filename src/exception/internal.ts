import { APIError } from './api'

export class InternalError extends APIError {

    public constructor (logMessage: string) {
        super({ message: 'Internal Error', statusCode: 500 }, logMessage)
    }

}
