import atob from 'atob'
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
            console.log('connecting with database firestore...')
            const dbConnection = JSON.parse(atob(process.env.DB_CONNECTION))
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
        await this.db.doc(document.id).update(document)
    }

    public async all () {
        const all = []
        const result = await this.db.get()

        for (let i = 0; i < result.docs.length; i++) {
            all.push(result.docs[i].data())
        }

        return all
    }

    public async getById (id: any) {
        const result = await this.db.doc(id).get()
        if (result.empty) {
            return undefined
        }

        return result.data()
    }

}
