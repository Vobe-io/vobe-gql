import {PostModel} from "../../../Models.js"


export default (user) => PostModel.find({owner: user._id.toString()});