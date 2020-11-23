import BaseRepository from './baseRepository'

class UserGameRewards extends BaseRepository {

    static instance: UserGameRewards;

    public constructor () {
        if (!UserGameRewards.instance) {
            super('user-game-rewards');
            UserGameRewards.instance = this;
        }

        return UserGameRewards.instance;
    }

    public async create (document: any): Promise<any> {
        document.id = document.email;
        return super.create(document);
    }

    public async getByEmail (email: any): Promise<any> {
        return super.getById(email);
    }

}

export default new UserGameRewards()
