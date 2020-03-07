import TokenGenerator from 'uuid-token-generator';
import SessionModel from '../models/SessionModel.js';


export default class Auth {

    token;

    constructor(token) {
        this.token = token;
    }

    user = async () => {
        let Session = await SessionModel.findOne({token: this.token});
        return Session.getUser();
    }
}

export class AuthPipeline {
    items = [];

    use = (item) => this.items.push(() => new Promise(async (resolve, reject) => {
        if (item instanceof Array)
            return resolve(item.forEach(item => this.use(item)));
        if (item instanceof Boolean)
            return resolve(item);
        if (item instanceof Function)
            return this.use(await item());

        return reject(new Error('AuthPipelineError: Given Object is not supported. -> ' + typeof item));
    }));

    process = () => new Promise(async (resolve, reject) => {
        Promise.all(this.items.map(f => f())).resolve(resolves => {
            if (resolves.includes(false))
                return reject(resolves);
            return resolve(!resolves.includes(false));
        })
    });
}

export const genToken = (size = 128) => `${Date.now().toString(36)}.${new TokenGenerator(size)}`;