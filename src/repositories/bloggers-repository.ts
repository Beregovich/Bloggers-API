import {bloggers} from "./db";

type newBloggerType = {
    id: number;
    name: string;
    youtubeUrl: string;
}

export const bloggersRepository = {
    async getBloggers () {
        return await bloggers
    },
    async getBloggerById(id: number) {
        const blogger = await bloggers.find(b => b.id === id)
        if (blogger) return blogger
    },

    async createBlogger (newBlogger: newBloggerType){
        bloggers.push(newBlogger)
        return newBlogger
    },

    updateBloggerById (id: number, name: string, youtubeUrl: string) {
        const blogger = bloggers.find(b => b.id === id)
        if (blogger) {
            blogger.name = name
            blogger.youtubeUrl = youtubeUrl
        }
    },

    deleteBloggerById(id: number)  {
        const BloggerToDel = bloggers.find(b => b.id === id)
        if (BloggerToDel) {
            bloggers.splice(bloggers.indexOf(BloggerToDel), 1)
            return true
        }else return false
    }
}

