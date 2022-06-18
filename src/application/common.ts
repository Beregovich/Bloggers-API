import {
    bloggersCollection,
    commentsCollection,
    limitsCollection,
    postsCollection,
    requestCollection,
    usersCollection
} from "../repositories/db";
import {bloggersModel, commentsModel, limitsModel, postsModel, usersModel} from "../repositories/db-with-mongoose";

export const getPaginationData = (query: any) => {
    const page = typeof query.PageNumber === 'string' ? +query.PageNumber : 1
    const pageSize = typeof query.PageSize === 'string' ? +query.PageSize : 10
    const searchNameTerm = typeof query.SearchNameTerm === 'string' ? query.SearchNameTerm : ""
    return {page, pageSize, searchNameTerm}
}

export async function removeAll() {
    await bloggersModel.deleteMany({})
    await postsModel.deleteMany({})
    await usersModel.deleteMany({})
    await commentsModel.deleteMany({})
    await limitsModel.deleteMany({})
}