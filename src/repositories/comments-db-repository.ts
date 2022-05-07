import {commentsCollection, UserType} from "./db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async getComments(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {login : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const comments = await commentsCollection
            .find(filter)
            .project({_id:0, passwordHash: 0,passwordSalt: 0 })
            .limit(pageSize)
            .toArray()
        delete comments.passwordHash
        delete comments.passwordSalt
        delete comments._id
        const totalCount = await commentsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: comments
        })
    },
    async createComment(newUser: UserType) {
        await commentsCollection.insertOne(newUser)
        const createdUser = await commentsCollection.findOne({id: newUser.id})
        return {
            id: createdUser.id,
            login: createdUser.login,
        }
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: new ObjectId(id)})
            return result.deletedCount === 1
        },
    async updateComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: new ObjectId(id)})
            return result.deletedCount === 1
        },
}

