import BaseRepository from './baseRepository'

class Distributions extends BaseRepository {

    public static instance: Distributions;

    public constructor () {
        if (!Distributions.instance) {
            super('distributions')
            Distributions.instance = this
        }

        return Distributions.instance
    }

    public async create (document: any): Promise<any> {
        document.id = `${Date.now()}`
        return super.create(document)
    }

}

export default new Distributions()
