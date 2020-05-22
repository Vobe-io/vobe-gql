import apollo from 'apollo-datasource-mongodb';
import mongoose from "mongoose";
import {UserModel} from "../../Models.js";
import { mutAuth } from "../../lib/Auth.js";
const { MongoDataSource } = apollo;

export default class Users extends MongoDataSource {
    getUser = async (userId) => {
        const user = await this.findOneById(mongoose.Types.ObjectId(userId));
        if (!user) throw Error("Could not find user");
        return user;
    }
    getUserByName = async (username) => {
        const user = await UserModel.findOne({username: username});
        if (!user) throw Error("Could not find user");
        return user;
    }
    getUsers = async (last) => last > 0 ? await UserModel.find().sort({$natural:-1}).limit(last) : await UserModel.find().sort({$natural:-1});

    delete = async (userId) => await UserModel.findByIdAndDelete(userId);

    default = async (_id) => await this.getUser(_id);

    auth = async (_objectId, user, roles, scopes) =>
        await mutAuth(_objectId, user, this, roles, scopes);
}