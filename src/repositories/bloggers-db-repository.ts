import {bloggersCollection, BloggerType, postsCollection} from "./db";
import {ObjectId} from "mongodb";

export const bloggersRepository = {
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {name : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const bloggers = await bloggersCollection
            .find(filter)
            .project({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await bloggersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        })
    },
    async getBloggerById(bloggerId: string): Promise<BloggerType | false> {
        const blogger = await bloggersCollection.findOne({id: bloggerId})
        if (blogger) {
            delete blogger._id
            return blogger
        }else return false
    },
    async createBlogger(newBlogger: BloggerType) {
        await bloggersCollection.insertOne(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    },
    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await bloggersCollection.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": youtubeUrl
                }
            })
         await postsCollection.updateMany( {bloggerId: id},
            {$set: {
                    "bloggerName": name
                }}
        )
        return result.modifiedCount === 1
    },
    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})
            return result.deletedCount === 1
        }
}

