import axios, { Method } from 'axios'

const executeRequest = async function (type: string, url: string, data: any, headers: any = {}) {
    try {
        const result = await axios({
            method: type as Method,
            headers,
            url,
            data
        })

        return result.data
    } catch (error) {
        const err = new Error()

        err.message = error.message
        if (error.response && error.response.data) {
            err.message = error.response.data
        }

        throw err
    }
}

export class HTTPRequester {

    public static async get (url: string, headers: any = {}) {
        return executeRequest('GET', url, {}, headers)
    }

    public static async getStream (url: string): Promise<any> {
        const result = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        return result.data
    }

    public static async post (url: string, data: any, headers: any = {}) {
        return executeRequest('POST', url, data, headers)
    }

}
