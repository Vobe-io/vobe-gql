import Schema from "../Schema.js";
import PostModel from "../../models/PostModel.js";
import UserModel from "../../models/UserModel.js";


export default class PostSchema extends Schema {

    name = 'Post';
    resolver = {
        parent: (post) => post.parent ? PostModel.findOne({_id: post.parent.toString()}) : null,
        children: (post) => PostModel.find({parent: post._id.toString()}),
        owner: (post) => post.owner ? UserModel.findOne({_id: post.owner.toString()}) : null
    }

}