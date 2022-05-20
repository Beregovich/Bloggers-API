import {bloggersCollection, postsCollection} from "./db";
import * as MongoClient from 'mongodb';
import {IBloggersRepository} from "../domain/bloggers-service";
import {BloggerType, EntityWithPaginationType, PostType} from "../types/types";

export class BloggersRepository implements IBloggersRepository {
    constructor(private bloggersCollection: MongoClient.Collection<BloggerType>,
                private postsCollection: MongoClient.Collection<PostType>) {
    }
    async getBloggers(page: number,
                      pageSize: number,
                      searchNameTerm: string): Promise<EntityWithPaginationType<BloggerType[]>> {
        const filter = {name: {$regex: searchNameTerm ? searchNameTerm : ""}}
        const bloggers = await this.bloggersCollection
            .find(filter)
            .project<BloggerType>({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const totalCount = await this.bloggersCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: bloggers
        })
    }
    async getBloggerById(bloggerId: string): Promise<BloggerType | null> {
        const blogger = await this.bloggersCollection.findOne({id: bloggerId}, {projection: {_id: 0}})
        if (blogger) {
            return blogger
        } else return null
    }
    async createBlogger(newBlogger: BloggerType) {
        await this.bloggersCollection.insertOne(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    }
    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await this.bloggersCollection.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": youtubeUrl
                }
            })
        await this.postsCollection.updateMany({bloggerId: id},
            {
                $set: {
                    "bloggerName": name
                }
            }
        )
        return result.modifiedCount === 1
    }

    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await this.bloggersCollection.deleteOne({id})
        return result.deletedCount === 1
    }

}
export const bloggersRepository = new BloggersRepository(bloggersCollection, postsCollection)

