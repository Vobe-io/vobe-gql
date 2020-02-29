import mongoose from 'mongoose';
import bson from 'bson';

let PostSchema = new mongoose.Schema({

    owner: {
        type: bson.ObjectId,
        required: true
    },
    parent: {
        type: bson.ObjectId,
        required: false,
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    }
});

let PostModel = mongoose.model('post', PostSchema);
export default PostModel;