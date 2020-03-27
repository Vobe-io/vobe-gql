import {Module} from "../lib/ModuleLoader.js";
import mongoose from 'mongoose';
import Status from "../lib/Status.js";

export default class MongooseModule extends Module {

    name = 'Mongoose';
    index = -1;

    async load() {
        await mongoose.connect('mongodb://vobe-mongo:27017/vobe?readPreference=primary&appname=VOBE-GQL&ssl=false', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        return new Status(!!mongoose);
    }

}
