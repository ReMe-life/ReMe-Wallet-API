import { AES } from 'crypto-js'

export class CryptoService {

    public static encrypt (data: any): string {
        return AES.encrypt(data, process.env.TOKEN_ENC_SECRET).toString()
    }

}
