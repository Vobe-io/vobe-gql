import {PostModel} from "../../../Models.js";


export default (post) => post.parent ? PostModel.findOne({_id: post.parent.toString()}) : null;