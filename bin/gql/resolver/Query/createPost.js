import {PostModel} from "../../../Models.js";
import bson from 'bson';


export default async (p, args, context, info) => {
    console.log(context);

    const {text, parent} = args;
    const {user} = context;

    if (!user)
        throw new Error("You need to be logged in to post something");
    if (!text)
        throw new Error("No post content is provided");

    return await new PostModel({
        owner: bson.ObjectId.createFromHexString(user._id.toString()),
        parent: parent ? bson.ObjectId.createFromHexString(parent.toString()) : undefined,
        text: args.text
    }).save();
}