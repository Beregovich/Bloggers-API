import {bloggersRepository} from "../repositories/bloggers-repository";

export const bloggersService = {
    async getBloggers() {
        return await bloggersRepository.getBloggers()
    },
    async getBloggerById(id: number) {
        return await bloggersRepository.getBloggerById(id)
    },
    async createBlogger(name: string, youtubeUrl: string) {
        const bloggerToPush = {
            id: +(new Date()),
            name,
            youtubeUrl
        }
        return await bloggersRepository.createBlogger(bloggerToPush)
    },

    async updateBloggerById(id: number, name: string, youtubeUrl: string) {
        return await bloggersRepository.updateBloggerById(id, name, youtubeUrl)
    },

    async deleteBloggerById(id: number) {
        return await bloggersRepository.deleteBloggerById(id)

    }
}


