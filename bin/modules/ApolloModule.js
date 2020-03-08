import {Module} from "../lib/ModuleLoader.js";
import apollo from "apollo-server";
import Status from "../lib/Status.js";
import * as path from 'path';
import GQLLoader from "../lib/GQLLoader.js";


const {ApolloServer} = apollo;

export default class ApolloModule extends Module {

    name = 'Apollo';
    index = 0;

    async load() {
        let basePath = path.join(process.cwd(), 'bin/gql');

        let loader = new GQLLoader();
        await loader.loadResolver(path.join(basePath, 'resolver'));
        await loader.loadTypes(path.join(basePath, 'typeDefs'));

        const server = new ApolloServer({
            typeDefs: loader.typeDefs,
            resolvers: loader.resolver,
        });

        let si = await server.listen();
        return new Status(true, si)
    }

}