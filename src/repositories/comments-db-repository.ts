import {commentsCollection, CommentType, QueryDataType, UserType} from "./db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async getComments(paginationData: QueryDataType, postId: string | null) {
        //const filter = {login : {$regex : searchNameTerm ? searchNameTerm : ""}}
        let filter = postId
            ?{title : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}, postId }
            :{title : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}}
        const comments = await commentsCollection
            .find(filter)
            .project({_id:0, passwordHash: 0})
            .skip((paginationData.page - 1) * paginationData.pageSize)
            .limit(paginationData.pageSize)
            .toArray()
        const totalCount = await commentsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / paginationData.pageSize)
        return ({
            pagesCount,
            page: paginationData.page,
            pageSize: paginationData.pageSize,
            totalCount,
            items: comments
        })
    },
    async createComment(newComment: CommentType) {
        await commentsCollection.insertOne(newComment)
        const createdComment = await commentsCollection.findOne({id: newComment.id})

        return createdComment
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id})
            return result.deletedCount === 1
        },
    async updateComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id})
            return result.deletedCount === 1
        },
    async getCommentById(commentId: string) {
        const comment = await commentsCollection.findOne({id: commentId}, {_id:false})
        delete comment._id
        return comment
    }
}

