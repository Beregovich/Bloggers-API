import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType} from "../repositories/db";
import { v4 as uuidv4 } from 'uuid'

export const bloggersService = {

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
}


