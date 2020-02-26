import {Module} from "../lib/ModuleLoader.js";
import apollo from "apollo-server";
import Status from "../lib/Status.js";

const {ApolloServer, gql} = apollo;

export default class ApolloModule extends Module {

    name = 'Apollo';
    index = 0;

    async load() {

        const typeDefs = gql`
            type Book {
                title: String
                author: String
            }
            type Query {
                books: [Book]
            }
        `;

        const books = [
            {
                title: 'Harry Potter and the Chamber of Secrets',
                author: 'J.K. Rowling',
            },
            {
                title: 'Jurassic Park',
                author: 'Michael Crichton',
            },
        ];

        const resolvers = {
            Query: {
                books: () => books,
            },
        };

        const server = new ApolloServer({typeDefs, resolvers});

        let si = await server.listen();
        return new Status(true, si)
    }

}