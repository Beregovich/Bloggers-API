import {bloggersCollection, BloggerType, postsCollection} from "./db";

export const bloggersRepository = {
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        const filter = {name : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const bloggers = await bloggersCollection
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = (await bloggersCollection.find(filter).toArray()).length //Плохо, 2й вызов БД
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        })
    },
    async getBloggerById(bloggerId: number): Promise<BloggerType | false> {
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
    async updateBloggerById(id: number, name: string, youtubeUrl: string) {
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
    async deleteBloggerById(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})
            return result.deletedCount === 1
        }
}

