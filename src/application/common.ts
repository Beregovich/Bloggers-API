import {iocContainer} from "../IocContainer";
import {TYPES} from "../iocTYPES";
import mongoose from "mongoose";
import {BloggerType, CommentType, LimitsControlType, PostType, UserType} from "../types/types";
const bloggersModel = iocContainer.get<mongoose.Model<BloggerType>>(TYPES.bloggersModel)
const postsModel = iocContainer.get<mongoose.Model<PostType>>(TYPES.postsModel)
const usersModel = iocContainer.get<mongoose.Model<UserType>>(TYPES.usersModel)
const commentsModel = iocContainer.get<mongoose.Model<CommentType>>(TYPES.commentsModel)
const limitsModel = iocContainer.get<mongoose.Model<LimitsControlType>>(TYPES.limitsModel)

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