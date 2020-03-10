import {UserModel} from "../../../Models.js";
import {REGEX} from "../../../vobe-util.js";
import {AuthPayload} from "../../../lib/Auth.js";


export default async (parent, args, context, info) => {

    const {username, email, password} = args;

    if (!username)
        throw new Error("username is not defined.");

    if (!email)
        throw new Error("email is not defined.");

    if (!password)
        throw new Error("password is not defined.");

    if (!REGEX.email.test(email))
        throw new Error("Email has bad format.");

    if (!REGEX.username.test(username))
        throw new Error("Username has bad format.");

    if (!REGEX.password.test(password))
        throw new Error("Password must contain 6 to 128 character.");

    if ((await UserModel.find({username: username})).length > 0)
        throw new Error(`Username '${username}' is already taken.`);

    if ((await UserModel.find({email: email}).length > 0))
        throw new Error(`Email '${email}' is already taken.`);

    let user = new UserModel({
        username: username,
        displayName: username,
        email: email,
        password: password
    }).save();

    if (!user)
        throw new Error("Couldn't create user.");

    return new AuthPayload().create({user: user});
};