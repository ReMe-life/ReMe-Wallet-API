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
        console.log('inside:crate->user.', document.email)
        const user = await this.getByEmail(document.email)
        console.log('getemail:crate->user.')
        if (user) {
            throw new Error('User with such email already exists')
        }

        document.id = document.email
        console.log('return:crate->user.', document.id)
        return super.create(document)
    }

    public async getByEmail (email: any): Promise<any> {
        console.log('inside email: return ', email)
        return super.getById(email)
    }

}

export default new Users()
