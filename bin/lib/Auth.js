import { SessionModel, UserModel } from "../Models.js";

export default class Auth {
    token;

    constructor(token) {
        this.token = token;
    }

    static auth = async (token) => await SessionModel.findOne({ token: token });

    user = async () => {
        let Session = await SessionModel.findOne({ token: this.token });
        if (Session) return await Session.getUser(Session.userId);
    };
}

export class AuthPayload {
    token;
    user;

    async create({ user, token }) {
        if (!!token) {
            this.token = token;
            const { session, user } = this.getSessionUser(this.token);
            if (!user) throw new Error("Could not get user from Id");
            this.user = user;

            return this;
        }
        if (!!user) {
            this.user = user;

            if (user instanceof Promise) this.user = await this.user;

            let session = await this.createSession(this.user);
            this.token = session.token;

            return this;
        }
        return this;
    }

    getSessionUser = async (token) => {
        let session = await SessionModel.findOne({ token: this.token });
        let user = await UserModel.findOne({ _id: session.userId });

        return { session: session, user: user };
    };

    createSession = async (user) =>
        await new SessionModel({ userId: user._id }).save();
}

// Handles authentication on mutations
export async function mutAuth(
    _objectId,
    user,
    dataSource,
    roles = ["ADMIN", "OBSERVER"],
    scopes = ["owner"]
) {
    if (user) {
        if (_objectId) {
            const object = await dataSource.default(_objectId);
            if (object) {
                if (_objectId.toString() === user._id.toString()) return true;
                if (object.scopes)
                    for (var scope of object.scopes)
                        if (
                            scope._id.toString() ===
                                user._id.toString.toString() &&
                            scopes.includes(scope.name)
                        )
                            return true;
                if (
                    object.owner &&
                    object.owner.toString() === user._id.toString()
                )
                    return true;
            } else throw Error("Could not find object");
        }
        if (user.role && roles.includes(user.role)) return true;
    } else throw Error("You must be logged in to execute this query");
    throw Error("You have no right to run this query.");
}
