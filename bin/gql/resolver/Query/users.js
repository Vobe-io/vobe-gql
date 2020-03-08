import {UserModel} from "../../../Models.js"
import QueryResolver from "../../../lib/QueryResolver.js";


export default new QueryResolver(
    {requireToken: true},
    async (parent, args, context, info) =>
        UserModel.find({})
).get;