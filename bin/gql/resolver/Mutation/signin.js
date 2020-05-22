import {AuthPayload} from "../../../lib/Auth.js";
import {UserModel} from "../../../Models.js";
import bcrypt from "bcrypt";


export default async (parent, args, context, info) => {

    if (!args['password'])
        throw new Error("Password is not defined");

    if (!args['identity'])
        throw new Error("Identity is not defined");

    let user = await UserModel.findOne(
        /^(.*[@].*)$/gim.test(args['identity']) ?
            {email: args['identity']} :
            {username: args['identity']});

    if (!user)
        throw new Error("User is not defined");

    if (!(await bcrypt.compare(args['password'], user.password)))
        throw new Error("Password does not match");

    return new AuthPayload().create({user: user});
};