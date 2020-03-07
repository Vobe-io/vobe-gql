import {PostModel} from "../../../Models.js";


export default (post) => PostModel.find({parent: post._id.toString()});