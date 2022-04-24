import {UserType} from "../repositories/db";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken'

export const usersService = {
    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const users = await usersRepository.getUsers(page, pageSize, searchNameTerm)
        return users
    },
    async createUser(username: string, password: string): Promise<UserType> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser = {
            id: new ObjectId(),
            username,
            passwordHash,
            passwordSalt
        }
        const result = await usersRepository.createUser(newUser)
        return result
    },

    async updateUserById(id: number, name: string, youtubeUrl: string): Promise<UserType | boolean> {
        const result = await usersRepository.updateUser(id, name, youtubeUrl)
        return result
    },

    async deleteUserById(id: number): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(username: string, password: string) {
        const user = await usersRepository.findUserByUsername(username)
        if (!user) return {
            resultCode: 1,
            data: {
                token: null
            }
        }
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        const result = user.passwordHash === passwordHash
        if (result) {
            const token = jwt.sign({userId: user._id}, 'topSecretKey', {expiresIn: '1d'})
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

