import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType} from "../repositories/db";

export const bloggersService = {

    async getBloggers(page: number, pageSize: number, searchNameTerm: string) {
        return await bloggersRepository.getBloggers(page, pageSize, searchNameTerm)
    },
    async getBloggerById(id: number): Promise<BloggerType | boolean> {
        return await bloggersRepository.getBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType> {
        const bloggerToPush = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        return await bloggersRepository.createBlogger(bloggerToPush)
    },

    async updateBloggerById(id: number, name: string, youtubeUrl: string): Promise<BloggerType | boolean> {
        const bloggerResult = await bloggersRepository.updateBloggerById(id, name, youtubeUrl)
        return bloggerResult
    },

    async deleteBloggerById(id: number): Promise<boolean> {
        return await bloggersRepository.deleteBloggerById(id)
    }
}


