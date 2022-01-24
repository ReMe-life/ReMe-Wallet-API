import BaseRepository from './baseRepository'

class Users extends BaseRepository {

    public static instance: Users;

    public constructor () {
        if (!Users.instance) {
            super('users')
            Users.instance = this
        }

        return Users.instance
    }

    public async create (document: any): Promise<any> {
        const user = await this.getByEmail(document.email)
        if (user) {
            throw new Error('User with such email already exists')
        }

        document.id = document.email
        return super.create(document)
    }

    public async getByEmail (email: any): Promise<any> {
        return super.getById(email)
    }

}

export default new Users()
