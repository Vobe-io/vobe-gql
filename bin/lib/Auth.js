import TokenGenerator from 'uuid-token-generator';
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

export class AuthPipeline {
    items = [];

    /**
     *
     * @param item {Array<Boolean|Function>,Boolean|Function}
     * @param options
     * @returns {boolean}
     */
    run = (item, options = {cancelOnFalse: false}) => {
        if (options.cancelOnFalse && this.items.includes(false))
            return false;
        if (item instanceof Array)
            item.forEach(i => this.run(i, options));

        return !this.items.includes(false);
    }
}

export class AuthPayload {
    token;
    user;

    async constructor(token) {
        this.token = token;
        let session = await SessionModel.findOne({token: this.token});
        let user = await UserModel.findOne({_id: session.userId});
        if (!user) throw new Error('Could not get user from Id');
        this.user = user;
    }

    async constructor(user) {
        this.user = user;
        let session = await new SessionModel({userId: user.id}).save();
        this.token = session.token;
    }


}

export const genToken = (size = 128) => `${Date.now().toString(36)}.${new TokenGenerator(size)}`;