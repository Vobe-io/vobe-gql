import {SessionModel, UserModel} from '../Models.js';


export default class Auth {

    token;

    constructor(token) {
        this.token = token;
    }

    static auth = async (token) => await SessionModel.findOne({token: token});


    user = async () => {
        let Session = await SessionModel.findOne({token: this.token});
        return Session.getUser();
    };

}

export class AuthPayload {
    token;
    user;

    async create({user, token}) {

        if (!!token) {
            this.token = token;
            const {session, user} = this.getSessionUser(this.token);
            if (!user) throw new Error('Could not get user from Id');
            this.user = user;

            return this;
        }
        if (!!user) {
            this.user = user;

            if (user instanceof Promise)
                this.user = await this.user;

            console.log(this.user);

            let session = await this.createSession(this.user);
            this.token = session.token;

            return this;
        }
        return this;
    }

    getSessionUser = async (token) => {
        let session = await SessionModel.findOne({token: this.token});
        let user = await UserModel.findOne({_id: session.userId});

        return {session: session, user: user}
    };

    createSession = async (user) => await new SessionModel({userId: user._id}).save();


}