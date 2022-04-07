import {bloggers} from "./db";

type newBloggerInputType = {
    name: string;
    youtubeUrl: string;
}
export const getBloggers = () => {
    return bloggers
}
export const getBloggerById = (id: number) => {
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) return blogger
}

export const createBlogger = (newBlogger: newBloggerInputType) => {
    const bloggerToPush = {
        id: +(new Date()),
        name: newBlogger.name,
        youtubeUrl: newBlogger.youtubeUrl
    }
    bloggers.push(bloggerToPush)
    return bloggerToPush
}

export const updateBloggerById = (id: number, name: string, youtubeUrl: string) => {
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) {
        blogger.name = name
        blogger.youtubeUrl = youtubeUrl
    }
}

export const deleteBloggerById = (id: number) => {
    const BloggerToDel = bloggers.find(b => b.id === id)
    if (BloggerToDel) {
        bloggers.splice(bloggers.indexOf(BloggerToDel), 1)
    }
}
