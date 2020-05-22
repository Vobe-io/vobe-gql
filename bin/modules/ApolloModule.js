import { Module } from "../lib/ModuleLoader.js";
import apollo from "apollo-server";
import Status from "../lib/Status.js";
import * as path from "path";
import GQLLoader from "../lib/GQLLoader.js";
import Users from "../gql/dataSources/Users.js";
import Posts from "../gql/dataSources/Posts.js";
import mongoose from "mongoose";
import Auth from "../lib/Auth.js";

const { ApolloServer } = apollo;

export default class ApolloModule extends Module {
    name = "Apollo";
    index = 0;

    async load() {
        let basePath = path.join(process.cwd(), "bin/gql");

        let loader = new GQLLoader();
        await loader.loadResolver(path.join(basePath, "resolver"));
        await loader.loadDirectives(path.join(basePath, "directives"));
        await loader.loadTypes(path.join(basePath, "typeDefs"));

        const server = new ApolloServer({
            schemaDirectives: loader.directives,
            typeDefs: loader.typeDefs,
            resolvers: loader.resolver,
            dataSources: () => ({
                users: new Users(mongoose.connection.db.collection("users")),
                posts: new Posts(mongoose.connection.db.collection("posts")),
            }),
            context: async ({ req }) => {
                if (req.headers["token"]) {
                    const user = await new Auth(req.headers["token"]).user();
                    return { user };
                } else return req;
            },
        });
        let si = await server.listen();
        return new Status(true, si);
    }
}
