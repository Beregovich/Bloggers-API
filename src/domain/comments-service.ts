import {UserType} from "../repositories/db";
import {commentsRepository} from "../repositories/comments-db-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'


export const commentsService = {
    async getComments(page: number, pageSize: number, searchNameTerm: string) {
        const comments = await commentsRepository.getComments(page, pageSize, searchNameTerm)
        return comments
    },
    async createComment(login: string, password: string): Promise<UserType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser = {
            id: new ObjectId(),
        }
        const result = await commentsRepository.createComment(newUser)
        return result
    },
    async deleteComments(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    },
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
    }
}


