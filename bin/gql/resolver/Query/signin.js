import QueryResolver from "../../../lib/QueryResolver.js";
import {AuthPayload, AuthPipeline} from "../../../lib/Auth.js";
import {UserModel} from "../../../Models.js";
import bcrypt from "bcrypt";


export default new QueryResolver({requireToken: false},
    async (parent, args, context, info) => {
        let user = await UserModel.findOne(
            /^(.*[@].*)$/gim.test(args['identity']) ?
                {email: args['identity']} :
                {username: args['identity']});

        let passed = new AuthPipeline().run([
            user,
            args.password,
            args.identity,
            await bcrypt.compare(args.password, user.password)
        ]);

        if (!passed)
            return new Error("Sign-In did not pass");

        return new AuthPayload(user);

    }).get;