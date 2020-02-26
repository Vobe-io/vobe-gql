import {Module} from "../lib/ModuleLoader.js";
import mongoose from 'mongoose';
import Status from "../lib/Status.js";

export default class MongooseModule extends Module {

    name = 'Mongoose';
    index = -1;

    async load() {
        let connection = await mongoose.createConnection('mongodb://mongo:27017/vobe', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        return new Status(false);
    }

}