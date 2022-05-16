import {BloggersRepository, bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType, EntityWithPaginationType} from "../repositories/db";
import { v4 as uuidv4 } from 'uuid'

export class BloggersService {
    constructor(private bloggersRepository: BloggersRepository) {
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
export const bloggersService = new BloggersService(bloggersRepository)

/*export const bloggersService = {

    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        return await bloggersRepository.getBloggers(page, pageSize, searchNameTerm)
    },
    async getBloggerById(id: string): Promise<BloggerType | boolean> {
        return await bloggersRepository.getBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const bloggerToPush = {
            id: uuidv4(),
            name,
            youtubeUrl
        }
        return await bloggersRepository.createBlogger(bloggerToPush)
    },

    async updateBloggerById(id: string, name: string, youtubeUrl: string): Promise<BloggerType | boolean> {
        const bloggerResult = await bloggersRepository.updateBloggerById(id, name, youtubeUrl)
        return bloggerResult
    },

    async deleteBloggerById(id: string): Promise<boolean> {
        return await bloggersRepository.deleteBloggerById(id)
    }
}*/


