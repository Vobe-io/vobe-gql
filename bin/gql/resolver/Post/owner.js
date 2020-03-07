import {UserModel} from "../../../Models.js";


export default (post) => post.owner ? UserModel.findOne({_id: post.owner.toString()}) : null;