import firebase from 'firebase/app';
import 'firebase/firestore';

import { BaseDatabase } from './baseDatabase'

export class FirebaseDatabase implements BaseDatabase {

    private db: any;
    private config: any;
    private collection: string;

    public constructor (config: any, collection: string) {
        this.config = config;
        this.collection = collection;
    }

    public async initialize () {
        if (firebase.apps.length === 0) {
            firebase.initializeApp(this.config);
        }

        const db = firebase.firestore();
        this.db = db.collection(this.collection);
    }

    async create (document: any) {
        if (document.id) {
            return this.db.doc(document.id).set(document);
        }

        return this.db.doc().set(document);
    }

    async update (document: any) {
        return this.db.doc(document.id).set(document, { merge: true });
    }

    async getById (id: any) {
        const result = await this.db.doc(id).get();
        if (result.empty) {
            return undefined
        }

        return result.data();
    }

}
