import {PostModel} from "../../../Models.js";


export default async (parent, args, context, info) => PostModel.findOne({_id: args._id});