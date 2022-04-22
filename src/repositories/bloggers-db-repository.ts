import {bloggersCollection, BloggerType} from "./db";

export const bloggersRepository = {
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        let allBloggers = await bloggersCollection.find().toArray()
        const totalCount = allBloggers.length
        const pagesCount = Math.ceil(allBloggers.length / pageSize)

        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: allBloggers.slice((page - 1) * pageSize, page * pageSize)
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
        return result.modifiedCount === 1
    },
    async deleteBloggerById(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id})
            return result.deletedCount === 1
        }
}

