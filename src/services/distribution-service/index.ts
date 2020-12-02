import { abi } from './abi.json'
import { Contract, providers, Wallet } from 'ethers'

class DistributionService {

    private contract: any
    public static instance: DistributionService

    public constructor () {
        if (!DistributionService.instance) {
            const provider = new providers.JsonRpcProvider(process.env.BLOCKCHAIN_NETWORK)
            const wallet = new Wallet(process.env.ADMIN_PRIVATE_KEY, provider)
            this.contract = new Contract(process.env.DISTRIBUTION_CONTRACT, JSON.stringify(abi), wallet)

            DistributionService.instance = this
        }

        return DistributionService.instance
    }

    public async getTotalClaimed (address: string): Promise<any> {
        return this.contract.claimedTokensPerUser(address)
    }

    public async updateRootHash (hash: string): Promise<void> {
        return this.contract.setRoot(hash)
    }
}

export default new DistributionService()