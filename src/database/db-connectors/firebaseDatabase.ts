import admin from 'firebase-admin'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { BaseDatabase } from './baseDatabase'

export class FirebaseDatabase implements BaseDatabase {

    private db: any;
    private collection: string;

    public constructor (collection: string) {
        this.collection = collection
    }

    public async initialize () {
        if (firebase.apps.length === 0) {
            const dbConnection = JSON.parse(process.env.DB_CONNECTION)
            firebase.initializeApp({
                projectId: dbConnection.serviceAccount.projectId,
                credential: admin.credential.cert(dbConnection.serviceAccount),
                databaseURL: dbConnection.url
            })
        }

        const db = firebase.firestore()
        this.db = db.collection(this.collection)
    }

    public async create (document: any) {
        if (document.id) {
            return this.db.doc(document.id).set(document)
        }

        return this.db.doc().set(document)
    }

    public async update (document: any) {
        await this.db.doc(document.id).update()
    }

    public async all () {
        const result = await this.db.get()
        result.docs.map((doc: any) => doc.data())

        return result.docs
    }

    public async getById (id: any) {
        const result = await this.db.doc(id).get()
        if (result.empty) {
            return undefined
        }

        return result.data()
    }

}
