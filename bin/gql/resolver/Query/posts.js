import {PostModel} from "../../../Models.js"


export default async (parent, args, context, info) => await PostModel.find({});