import { AES } from 'crypto-js'

export class CryptoService {

    public static encryptData (data: any): string {
        return AES.encrypt(JSON.stringify(data), process.env.TOKEN_ENC_SECRET).toString()
    }

    public static encryptText (text: any): string {
        return AES.encrypt(text, process.env.TOKEN_ENC_SECRET).toString()
    }

}
