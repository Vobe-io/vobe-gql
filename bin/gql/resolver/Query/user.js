import {UserModel} from "../../../Models.js"


export default async (parent, args, context, info) => {
    if (args._id !== undefined)
        return UserModel.findOne({_id: args._id});
    if (args.username !== undefined)
        return UserModel.findOne({username: args.username});
}