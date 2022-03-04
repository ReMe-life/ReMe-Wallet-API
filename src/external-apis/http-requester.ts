import axios, { Method } from 'axios'

/*

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})
*/

const executeRequest = async function (type: string, url: string, data: any, headers: any = {}) {
    try {
        /* axios.defaults.httpsAgent = httpsAgent
        console.log("Header passed", headers) */

        const result = await axios({
            method: type as Method,
            headers,
            url,
            data
        })

        /* console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`) */

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
        return executeRequest('GET', url, undefined, headers)
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
