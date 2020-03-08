import {UserModel} from "../../../Models.js"
import QueryResolver from "../../../lib/QueryResolver.js";


export default new QueryResolver(
    {requireToken: true},
    async (parent, args, context, info) => {
        if (args._id !== undefined)
            return UserModel.findOne({_id: args._id});
        if (args.username !== undefined)
            return UserModel.findOne({username: args.username});
    }).get;