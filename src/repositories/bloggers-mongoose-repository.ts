import {IBloggersRepository} from "../domain/bloggers-service";
import {BloggerType, EntityWithPaginationType, PostType} from "../types/types";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import mongoose from 'mongoose'
import {TYPES} from "../iocTYPES";


@injectable()
export class BloggersRepository implements IBloggersRepository {
    constructor(@inject(TYPES.bloggersModel) private bloggersModel: mongoose.Model<BloggerType>,
                @inject(TYPES.postsModel) private postsModel: mongoose.Model<PostType>) {
    }

    async getBloggers(page: number,
                      pageSize: number,
                      searchNameTerm: string): Promise<EntityWithPaginationType<BloggerType[]>> {
        const filter = {name: {$regex: searchNameTerm ? searchNameTerm : ""}}
        const bloggers = await this.bloggersModel
            .find(filter, {projection: {_id: 0}})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
        const totalCount = await this.bloggersModel.countDocuments(filter)
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
        const blogger = await this.bloggersModel
            .findOne({id: bloggerId}, {projection: {_id: 0}})
            .lean()
        if (blogger) {
            return blogger
        } else return null
    }

    async createBlogger(newBlogger: BloggerType) {
        await this.bloggersModel.create(newBlogger)
        return {
            id: newBlogger.id,
            name: newBlogger.name,
            youtubeUrl: newBlogger.youtubeUrl
        }
    }

    async updateBloggerById(id: string, name: string, youtubeUrl: string) {
        const result = await this.bloggersModel.updateOne({id},
            {
                $set: {
                    "name": name,
                    "youtubeUrl": youtubeUrl
                }
            })
        await this.postsModel.updateMany({bloggerId: id},
            {
                $set: {
                    "bloggerName": name
                }
            }
        )
        return result.modifiedCount === 1
    }

    async deleteBloggerById(id: string): Promise<boolean> {
        const result = await this.bloggersModel.deleteOne({id})
        return result.deletedCount === 1
    }
}


