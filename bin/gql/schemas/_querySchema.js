import PostModel from "../../models/PostModel.js";
import UserModel from "../../models/UserModel.js";
import Schema from "../Schema.js";


export default class QuerySchema extends Schema {

    name = 'Query';
    resolver = {
        users: async () => await UserModel.find({}),
        posts: async () => await PostModel.find({}),

        user: async (parent, args, context, info) => {
            if (args._id !== undefined)
                return UserModel.findOne({_id: args._id});
            if (args.username !== undefined)
                return UserModel.findOne({username: args.username});
        },
        post: async (parent, args, context, info) => PostModel.findOne({_id: args._id})

    };

}