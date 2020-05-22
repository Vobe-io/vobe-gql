import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    displayName: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },

    verified: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['ADMIN', 'OBSERVER', 'USER','PENDING', 'BANNED'],
        default: 'PENDING'
    },
    created: {
        type: Date,
        default: Date.now
    },
    scopes: {
        type: [Object],
        required: true,
        default: []
    }
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    })
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
    UserModel.findOne({username: username}).exec(async function (err, user) {
        if (err) return callback(err);
        else if (!user) {
            let err = new Error('UserModel not found.');
            err.status = 401;
            return callback(err);
        }
        await bcrypt.compare(password, user.password, function (err, result) {
            if (result === true)
                return callback(null, user);
            else {
                let err = new Error('Password wrong.');
                err.status = 401;
                return callback(err);
            }
        })
    });
};

//check if user email is verified
UserSchema.statics.isEmailVerified = function (userID, callback) {
    UserModel.findOne({_id: userID}).exec((err, user) => callback(user.emailVerified));
};

let UserModel = mongoose.model('user', UserSchema);
export default UserModel;