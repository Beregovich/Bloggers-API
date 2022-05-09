import {QueryDataType, UserType} from "../repositories/db";
import {commentsRepository} from "../repositories/comments-db-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";


export const commentsService = {
    //======================GET COMMENTS WITH PAGINATION====================
    async getComments(paginationData: QueryDataType, PostId: string | null) {
        const comments = await commentsRepository.getComments(paginationData, PostId)
        return comments
    },
    async getCommentById(commentId: string) {
        const comment = await commentsRepository.getCommentById(commentId)
        return comment
    },
    async updateCommentById(commentId: string) {
        const comment = await commentsRepository.updateComment(commentId)
        return comment
    },
    async createComment(paginationData: QueryDataType, content: string, postId: string, userLogin: string) {
        const newComment = {
            id: uuidv4(),
            content,
            postId,
            userLogin,
            addedAt: new Date()
        }
        const result = await commentsRepository.createComment(newComment)
        return result
    },
     async deleteComment(id: string): Promise<boolean> {
         return await commentsRepository.deleteComment(id)
     },/*
     async _generateHash(password: string, salt: string) {
         const hash = await bcrypt.hash(password, salt)
         return hash
     },
     async checkCredentials(login: string, password: string) {
         const user = await commentsRepository.findUserByLogin(login)
         if (!user) return {
             resultCode: 1,
             data: {
                 token: null
             }
         }
         const passwordHash = await this._generateHash(password, user.passwordSalt)
         const result = user.passwordHash === passwordHash
         if (result) {
             const token = jwt.sign({userId: user.id}, 'topSecretKey', {expiresIn: '1d'})
             return {
                 resultCode: 0,
                 data: {
                     token: token
                 }
             }
         } else {
             return {
                 resultCode: 1,
                 data: {
                     token: null
                 }
             }
         }
     }*/

}


