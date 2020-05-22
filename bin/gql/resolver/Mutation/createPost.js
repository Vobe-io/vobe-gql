export default async (
    p,
    { text, parent },
    { dataSources: { posts }, user },
    info
) => {
    if (await posts.auth(null, user, ["USER", "OBSERVER", "ADMIN"])) {
        return await posts.create(user._id, text, parent);
    }
};
