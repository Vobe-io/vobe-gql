import mongoose from 'mongoose';
import bson from 'bson';
import {UserModel} from "../Models.js";
import TokenGenerator from "uuid-token-generator";


let SessionSchema = new mongoose.Schema({
    userId: {
        type: bson.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    token: {
        type: String,
        required: true,
        default: `${Date.now().toString(36)}.${new TokenGenerator(128).generate().toLowerCase()}`
    }
});

SessionSchema.methods.getUser = async (userId) => await UserModel.findOne({_id: userId});

let SessionModel = mongoose.model('session', SessionSchema);
export default SessionModel;