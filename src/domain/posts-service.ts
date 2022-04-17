import { postsRepository} from "../repositories/posts-db-repository";
import {PostType} from "../repositories/db";

export const postsService = {
    async getPosts() {
        const posts: PostType[] = await postsRepository.getPosts()
        return posts

    },
    async getPostById(id: number) {
        const post = await postsRepository.getPostById(id)
        if(post){
            return post
        }else return false
    },
    async createPost(newPostData: PostType) {
        const postToCreate = {
            ...newPostData,
            id: +(new Date()),
        }
        return await postsRepository.createPost(postToCreate)

    },
    async updatePostById(id: number, newPost: PostType) {
        return await postsRepository.updatePostById({
            id,
            ...newPost
        })
    },
    async deletePostById(id: number) {
        return await postsRepository.deletePostById(id)
    },

    async getPostsByBloggerId(bloggerId: number){
        return await postsRepository.getPostsByBloggerId(bloggerId)
}
}