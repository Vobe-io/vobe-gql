export default async (parent, {last}, {dataSources: {users}}, info) => users.getUsers(last);