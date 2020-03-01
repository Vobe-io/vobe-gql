import Schema from "../Schema.js";
import PostModel from "../../models/PostModel.js";

export default class User extends Schema {

    name = "User";
    resolver = {
        posts: (user) => PostModel.find({owner: user._id.toString()})
    };

}