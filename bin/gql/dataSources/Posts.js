import apollo from "apollo-datasource-mongodb";
import mongoose from "mongoose";
import { PostModel } from "../../Models.js";
import { mutAuth } from "../../lib/Auth.js";
import bson from "bson";
const { MongoDataSource } = apollo;

export default class Posts extends MongoDataSource {
    getPost = async (postId) => {
        const post = await this.findOneById(mongoose.Types.ObjectId(postId));
        if (!post) throw Error("Could not find post");
        return post;
    };
    getPosts = async (last) =>
        last > 0
            ? await PostModel.find().sort({ $natural: -1 }).limit(last)
            : await PostModel.find().sort({ $natural: -1 });

    create = async (ownerId, text, parent) =>
        await new PostModel({
            owner: bson.ObjectId.createFromHexString(ownerId.toString()),
            parent: parent
                ? bson.ObjectId.createFromHexString(parent.toString())
                : undefined,
            text: text,
        }).save();

    delete = async (postId) =>
        await PostModel.findByIdAndDelete(postId);

    default = async (_id) => await this.getPost(_id);

    auth = async (_objectId, user, roles, scopes) =>
        await mutAuth(_objectId, user, this, roles, scopes);
}
