import mongoose from 'mongoose';
import bson from 'bson';
import * as Auth from "../lib/Auth.js";
import * as UserModel from "../models/UserModel.js";


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
        default: Auth.genToken()
    }
});

SessionSchema.methods.getUser = async () => await UserModel.findOne({_id: this.userId});

let SessionModel = mongoose.model('session', SessionSchema);
export default SessionModel;