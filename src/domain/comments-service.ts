import {commentsRepository} from "../repositories/comments-db-repository";
import {v4 as uuidv4} from "uuid";
import {QueryDataType} from "../types/types";

 class CommentsService  {
    async getComments(paginationData: QueryDataType, PostId: string | null) {
        const comments = await commentsRepository.getComments(paginationData, PostId)
        return comments
    }
    async getCommentById(commentId: string) {
        const result = await commentsRepository.getCommentById(commentId)
        return result
    }
    async updateCommentById(commentId: string, content: string) {
        const comment = await commentsRepository.updateComment(commentId, content)
        return comment
    }
    async createComment(paginationData: QueryDataType, content: string, postId: string, userLogin: string, userId:string) {
        const newComment = {
            id: uuidv4(),
            content,
            userId,
            postId,
            userLogin,
            addedAt: new Date()
        }
        const result = await commentsRepository.createComment(newComment)
        return result
    }
     async deleteComment(id: string): Promise<boolean> {
         return await commentsRepository.deleteComment(id)
     }
}
export const commentsService = new CommentsService()


