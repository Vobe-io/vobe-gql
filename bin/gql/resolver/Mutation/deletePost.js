export default async (_, { _id }, { dataSources: { posts }, user }, info) => {
    if (await posts.auth(_id, user)) {
        posts.delete(_id);
        return "Post deleted";
    }
};
