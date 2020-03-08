import Auth from "./Auth.js";
import deepMerge from "deepmerge";


export default class QueryResolver {

    options = {
        requireToken: true,
    };

    constructor(options, resolver) {
        this.options = deepMerge(this.options, options);
        this.resolver = resolver;
    }

    get = async (parent, args, context, info) => {
        if (this.options.requireToken && !(await Auth.auth(args.token)))
            throw new Error("Given token is not valid");
        return this.resolver(parent, args, context, info);
    }
}