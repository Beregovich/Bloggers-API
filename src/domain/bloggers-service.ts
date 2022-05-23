import {BloggersRepository} from "../repositories/bloggers-db-repository";
import { v4 as uuidv4 } from 'uuid'
import {BloggerType, EntityWithPaginationType} from "../types/types";
import {TYPES} from "../IoCContainer";
import {inject, injectable} from "inversify";

@injectable()
export class BloggersService {
    constructor(@inject<IBloggersRepository>(TYPES.IBloggersRepository) private bloggersRepository: BloggersRepository) {
    }
    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        return await this.bloggersRepository.getBloggers(page, pageSize, searchNameTerm)
    }
    async getBloggerById(id: string): Promise<BloggerType | null> {
        return await this.bloggersRepository.getBloggerById(id)
    }
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const bloggerToPush = {
            id: uuidv4(),
            name,
            youtubeUrl
        }
        return await this.bloggersRepository.createBlogger(bloggerToPush)
    }
    async updateBloggerById(id: string, name: string, youtubeUrl: string): Promise<BloggerType | boolean> {
        const bloggerResult = await this.bloggersRepository.updateBloggerById(id, name, youtubeUrl)
        return bloggerResult
    }
    async deleteBloggerById(id: string): Promise<boolean> {
        return await this.bloggersRepository.deleteBloggerById(id)
    }
}
export interface IBloggersRepository{
    getBloggers(page: number,
                pageSize: number,
                searchNameTerm: string): Promise<EntityWithPaginationType<BloggerType[]>>
    getBloggerById(id: string): Promise<BloggerType | null>
    createBlogger(newBlogger: BloggerType): Promise<BloggerType>
    updateBloggerById(id: string, name: string, youtubeUrl: string): Promise<BloggerType | boolean>
    deleteBloggerById(id: string): Promise<boolean>
}




