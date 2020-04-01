import mongoose from 'mongoose';
import randToken from 'rand-token';

let VerificationSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false,
        default: randToken.generate(64)
    },
    created: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    updated: {
        type: Date,
        required: false
    },
});

let VerificationModel = mongoose.model('verification', VerificationSchema);
export default VerificationModel;
