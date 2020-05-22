export default async (parent, {_id, username}, { dataSources: {users}, test}, info) => {
    if (_id !== undefined) return users.getUser(_id);
    else if (username !== undefined) return users.getUserByName(username);
}