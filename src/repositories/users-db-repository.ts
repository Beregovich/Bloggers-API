import {usersCollection} from "./db";
import {v4 as uuidv4} from 'uuid'
import {BloggerType, EntityWithPaginationType, UserType} from "../types/types";
import * as MongoClient from "mongodb";
import {IUsersRepository} from "../domain/users-service";

export class UsersRepository implements IUsersRepository {
    constructor(private usersCollection: MongoClient.Collection<UserType>) {
    }
    async getUsers(page: number,
                   pageSize: number,
                   searchNameTerm: string): Promise<EntityWithPaginationType<UserType[]>> {
        const filter = {"accountData.login": {$regex: searchNameTerm ? searchNameTerm : ""}}
        const users = await this.usersCollection
            .find(filter)
            .project<UserType>({_id: 0, passwordHash: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await this.usersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: users
        })
    }

    async createUser(newUser: UserType): Promise<UserType | null> {
        await this.usersCollection.insertOne(newUser)
        const createdUser = await this.usersCollection.findOne({"accountData.id": newUser.accountData.id})
        return createdUser
            ? createdUser
            : null
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await this.usersCollection.deleteOne({"accountData.id":id})
        return result.deletedCount === 1
    }

    findUserById(id: string): Promise<UserType | null> {
        const user = this.usersCollection.findOne({"accountData.id":id})
        return user
    }

    findUserByLogin(login: string): Promise<UserType | null> {
        const user = this.usersCollection.findOne({"accountData.login": login})
        return user
    }
    findUserByEmail(email: string): Promise<UserType | null> {
        const user = this.usersCollection.findOne({"accountData.email":email})
        return user
    }
    findUserByConfirmationCode(code: string): Promise<UserType | null> {
        const user = this.usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        return user
    }

    async updateConfirmation(id: string) {
        let result = await this.usersCollection
            .updateOne({id}, {$set: {"emailConfirmation.isConfirmed": true}})
        return result.modifiedCount === 1
    }

    async updateConfirmationCode(id: string) {
        let result = await this.usersCollection
            .updateOne({id}, {$set: {"emailConfirmation.confirmationCode": uuidv4()}})
        return result.modifiedCount === 1
    }
    async findExistingUser(login: string, email: string){
        const result = await this.usersCollection
            .findOne({$or: [{"accountData.login": login}, {"accountData.email": email}]})
        return result
    }
}

export const usersRepository = new UsersRepository(usersCollection)

