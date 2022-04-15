import {bloggers, bloggersCollection} from "./db";

type newBloggerType = {
    id: number;
    name: string;
    youtubeUrl: string;
}

export const bloggersRepository = {
    async getBloggers() {
        return await bloggersCollection.find().toArray()
    },
    async getBloggerById(id: number) {
        const blogger = await bloggersCollection.findOne({id})
        if (blogger) {
            delete blogger._id
            return blogger
        }else return false
    },

    async createBlogger(newBlogger: newBloggerType) {
        await bloggersCollection.insertOne(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    },
    async updateBloggerById(id: number, name: string, youtubeUrl: string) {
        const result = await bloggersCollection.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": youtubeUrl
                }
            })
        return result.modifiedCount === 1
    },

    async deleteBloggerById(id: number) {
        const result = await bloggersCollection.deleteOne({id})
            return result.deletedCount === 1
        }
}

