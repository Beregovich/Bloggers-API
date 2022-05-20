import {CommentsRepository, commentsRepository} from "../repositories/comments-db-repository";
import {v4 as uuidv4} from "uuid";
import { CommentType, EntityWithPaginationType, QueryDataType} from "../types/types";


 export class CommentsService  {
     constructor(private commentsRepository: CommentsRepository) {
     }
    async getComments(paginationData: QueryDataType, PostId: string | null) {
        const comments = await this.commentsRepository.getComments(paginationData, PostId)
        return comments
    }
    async getCommentById(commentId: string) {
        const result = await this.commentsRepository.getCommentById(commentId)
        return result
    }
    async updateCommentById(commentId: string, content: string) {
        const comment = await this.commentsRepository.updateCommentById(commentId, content)
        return comment
    }
    async createComment(content: string, postId: string, userLogin: string, userId:string) {
        const newComment = {
            id: uuidv4(),
            content,
            userId,
            postId,
            userLogin,
            addedAt: new Date()
        }
        const result = await this.commentsRepository.createComment(newComment)
        return result
    }
     async deleteComment(id: string): Promise<boolean> {
         return await this.commentsRepository.deleteComment(id)
     }
}
export interface ICommentRepository{
    getComments(paginationData: QueryDataType, PostId: string | null): Promise<EntityWithPaginationType<CommentType[]>>,
    getCommentById(commentId: string): Promise<CommentType | null>,
    updateCommentById(commentId: string, content: string): any,
    createComment(newComment: CommentType ): Promise<CommentType | null>,
    deleteComment(id: string): Promise<boolean>,
}
export const commentsService = new CommentsService(commentsRepository)


