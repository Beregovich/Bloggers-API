import {commentsCollection} from "./db";
import {CommentType, EntityWithPaginationType, QueryDataType} from "../types/types";
import * as MongoClient from 'mongodb';
import {ICommentRepository} from "../domain/comments-service";

export class CommentsRepository implements ICommentRepository{
    constructor(private commentsCollection: MongoClient.Collection<CommentType>) {
    }
    async getComments(paginationData: QueryDataType,
                      postId: string | null): Promise<EntityWithPaginationType<CommentType[]>> {
        let filter = postId
            ?{content : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}, postId }
            :{content : {$regex : paginationData.searchNameTerm ? paginationData.searchNameTerm : ""}}
        const comments = await this.commentsCollection
            .find(filter)
            .project<CommentType>({_id:0, postId: 0})
            .skip((paginationData.page - 1) * paginationData.pageSize)
            .limit(paginationData.pageSize)
            .toArray()
        const totalCount = await this.commentsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / paginationData.pageSize)
        return ({
            pagesCount,
            page: paginationData.page,
            pageSize: paginationData.pageSize,
            totalCount,
            items: comments
        })
    }
    async createComment(newComment: CommentType): Promise<CommentType | null> {
        await this.commentsCollection.insertOne(newComment)
        const createdComment = await this.commentsCollection
            .findOne<CommentType>({id: newComment.id}, {projection: {_id:0, postId:0}})
        return createdComment
    }
    async deleteComment(id: string): Promise<boolean> {
        const result = await this.commentsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await this.commentsCollection.updateOne({id}, {$set:{content: content}})
        return result.matchedCount === 1
    }
    async getCommentById(commentId: string) {
        const comment = await this.commentsCollection
            .findOne<CommentType>({id: commentId}, {projection: {_id:0, postId:0}})
        if (!comment) return null
        return comment
    }
}

export const commentsRepository = new CommentsRepository(commentsCollection)


