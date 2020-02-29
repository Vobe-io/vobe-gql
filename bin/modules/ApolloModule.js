import {Module} from "../lib/ModuleLoader.js";
import apollo from "apollo-server";
import Status from "../lib/Status.js";
import * as fs from 'fs';
import * as path from 'path';
import {getRootPath} from "../vobe-util.js";

const {ApolloServer, gql} = apollo;

export default class ApolloModule extends Module {

    name = 'Apollo';
    index = 0;

    async load() {

        const basePath = getRootPath('bin/gql/schemas');
        let typeDefs = '';
        let resolvers = {Query: {}};

        fs.readdirSync('bin/gql/typeDefs', {withFileTypes: true}).forEach(f =>
            typeDefs += fs.readFileSync(path.join('bin/gql/typeDefs', f.name)).toString());

        for (const f of fs.readdirSync(basePath, {withFileTypes: true})) {
            let clazz = new (await import(path.join(path.join(basePath, f.name)))).default();
            if (typeof clazz.resolver === 'function')
                resolvers.Query[clazz.name] = clazz.resolver;
            if (typeof clazz.resolver === 'object') {
                if (resolvers[clazz.name] === undefined)
                    resolvers[clazz.name] = clazz.resolver;
                else
                    Object.assign(resolvers[clazz.name], clazz.resolver)
            }
        }


        console.log(`GQL Queries:\n` + (() => {
            let out = '';
            Object.keys(resolvers).forEach(key => out += `\n${key}:\n -> ` + Object.keys(resolvers[key]).join('\n -> '));
            return out.trim();
        })());

        const server = new ApolloServer({
            typeDefs: (gql`${typeDefs}`),
            resolvers: resolvers
        });

        let si = await server.listen();
        return new Status(true, si)
    }

}