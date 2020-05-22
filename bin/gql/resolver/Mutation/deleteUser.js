export default async (_, { _id }, { dataSources: { users }, user }, info) => {
    if (await users.auth(_id, user, ["ADMIN"])) {
        users.delete(_id);
        return "User deleted";
    }
};
