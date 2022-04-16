import {NewPostType, postsRepository} from "../repositories/posts-db-repository";
import {bloggersRepository} from "../repositories/bloggers-db-repository";

export const postsService = {
    async getPosts() {
        const posts = await postsRepository.getPosts()
        return posts

    },
    async getPostById(id: number) {
        const post = await postsRepository.getPostById(id)
        //const blogger = await bloggersRepository.getBloggerById(post.blogId)
        if(post){
            return {
                ...post,
                //bloggerName: blogger.name
            }
        }else return false
    },
    async createPost(newPost: NewPostType) {
        const postToPush = {
            ...newPost,
            id: +(new Date()),
        }
        return await postsRepository.createPost(postToPush)

    },
    async updatePostById(id: number, newPost: NewPostType) {
        return await postsRepository.updatePostById({
            id,
            ...newPost
        })
    },
    async deletePostById(id: number) {
        return await postsRepository.deletePostById(id)
    }
}