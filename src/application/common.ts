import {
    bloggersCollection,
    commentsCollection,
    limitsCollection,
    postsCollection,
    requestCollection,
    usersCollection
} from "../repositories/db";

export const getPaginationData = (query: any) => {
    const page = typeof query.PageNumber === 'string' ? +query.PageNumber : 1
    const pageSize = typeof query.PageSize === 'string' ? +query.PageSize : 10
    const searchNameTerm = typeof query.SearchNameTerm === 'string' ? query.SearchNameTerm : ""
    return {page, pageSize, searchNameTerm}
}

export async function removeAll() {
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await requestCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await limitsCollection.deleteMany({})
}