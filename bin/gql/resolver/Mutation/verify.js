import {UserModel, VerificationModel} from "../../../Models.js";

export default async (parent, args, context, info) => {

    const {email, token} = args;
    if(!email)
        throw new Error("email is not defined");

    if(!token)
        throw new Error("token is not defined");

    await VerificationModel.findOneAndDelete({email: email, token: token}).then(async verification =>{
        if(!verification) throw new Error('Verification not valid');
        else await UserModel.findOneAndUpdate({email: email}, {emailVerified: true, role: 'USER'});
    });

    return "Email verified";
};
