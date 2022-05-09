import {UserType} from "../repositories/db";
import {usersRepository} from "../repositories/users-db-repository";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {authService} from "./auth-service";
import {v4 as uuidv4} from "uuid";

export const usersService = {

    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const users = await usersRepository.getUsers(page, pageSize, searchNameTerm)
        return users
    },
    async createUser(login: string, password: string): Promise<UserType> {
        const passwordHash = await authService._generateHash(password)
        const newUser = {
            id: uuidv4(),
            login,
            passwordHash,
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser
    },
    async deleteUserById(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    /*async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user) return {
            resultCode: 1,
            data: {
                token: null
            }
        }
        const passwordHash = await authService._generateHash(password)
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


