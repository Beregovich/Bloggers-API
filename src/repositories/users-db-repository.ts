import {usersCollection, UserType} from "./db";
import { v4 as uuidv4 } from 'uuid'

export const usersRepository = {
    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {login : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const users = await usersCollection
            .find(filter)
            .project({_id:0, passwordHash: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users
        })
    },
    async createUser(newUser: UserType) {
        await usersCollection.insertOne(newUser)
        const createdUser = await usersCollection.findOne({id: newUser.id})
        return {
            id: createdUser.id,
            login: createdUser.login,
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
            return result.deletedCount === 1
        },
    findUserById(id: string) {
        const user = usersCollection.findOne({id})
        return user
    },
    findUserByLogin(login: string) {
        const user = usersCollection.findOne({login})
        return user
    },
    async updateConfirmation(id: string){
        let result = await usersCollection
            .updateOne({id}, {$set: {"emailConfirmation.isConfirmed": true}} )
        return result.modifiedCount === 1
    },
    async updateConfirmationCode(id: string){
        let result = await usersCollection
            .updateOne({id}, {$set: {"emailConfirmation.confirmationCode": uuidv4()}} )
        return result.modifiedCount === 1
    }
}

