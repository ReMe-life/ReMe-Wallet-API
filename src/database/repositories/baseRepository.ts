import { FirebaseDatabase } from '../db-connectors/firebaseDatabase'

import DB_CONFIG from '../../config/db-config.json'

class BaseRepository {

    protected db: any;
    protected isReady: any;
    protected collection: string;

    public constructor (collection: string) {
        this.collection = collection

        this.db = new FirebaseDatabase(DB_CONFIG, collection);
        this.isReady = this.db.initialize()
    }

    public async create (document: any) {
        await this.isReady

        try {
            const data = await this.db.create(document);
            return data;
        } catch (error) {
            throw new Error(`Error when creating document for ${this.collection}: ${error.message}`);
        }
    }

    public async getById (id: any): Promise<any> {
        await this.isReady

        try {
            const data = await this.db.getById(id);
            return data
        } catch (error) {
            throw new Error(`Error when getting document for ${this.collection}: ${error.message}`);
        }
    }

}

export default BaseRepository
