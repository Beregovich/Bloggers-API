import {bloggersCollection, BloggerType, postsCollection, usersCollection, UserType} from "./db";

export const usersRepository = {
    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {username : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const users = await usersCollection
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = (await usersCollection.find(filter).toArray()).length //Плохо, 2й вызов БД
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
        return {
            id: newUser.id,
            username: newUser.username,
            passwordHash: newUser.passwordHash
        }
    },
    async updateUser(id: number, username: string, passwordHash: string) {
        const result = await usersCollection.updateOne({id},
            {
                $set: {
                    "username": username,
                    "passwordHash": passwordHash
                }
            })
        return result.modifiedCount === 1
    },
    async deleteUser(id: number): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
            return result.deletedCount === 1
        },
    findUserByUsername(username: string) {
        const user = usersCollection.findOne({username})
        return user
    }
}

