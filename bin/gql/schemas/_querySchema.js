import PostModel from "../../models/PostModel.js";
import UserModel from "../../models/UserModel.js";
import Schema from "../Schema.js";


export default class QuerySchema extends Schema {

    name = 'Query';
    resolver = {
        users: async () => await UserModel.find({}),
        posts: async () => await PostModel.find({}),

        user: async (parent, args, context, info) => UserModel.findOne({_id: args._id}),
        post: async (parent, args, context, info) => PostModel.findOne({_id: args._id})

    };

}