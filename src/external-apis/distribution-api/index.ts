import { HTTPRequester } from '../http-requester'

export class DistributionApi {

    public static async addMoreTokens (address: string, amount: any): Promise<any> {
        const result = await HTTPRequester.post(
            `${process.env.DISTRIBUTION_ENDPOINT}/merkletree`,
            { data: `${address.toLowerCase()}:${amount}` }
        )

        return result.index
    }

    public static async getRootHash (): Promise<string> {
        const result = await HTTPRequester.get(
            `${process.env.DISTRIBUTION_ENDPOINT}/merkletree`
        )

        return result.tree.root
    }

    public static async getProof (index: number): Promise<any[]> {
        const result = await HTTPRequester.get(
            `${process.env.DISTRIBUTION_ENDPOINT}/merkletree/hashes/${index}`
        )

        return result.hashes
    }

}
