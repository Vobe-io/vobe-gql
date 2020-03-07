import {UserModel} from "../../../Models.js"


export default async (parent, args, context, info) => {
    return await UserModel.find({})
}