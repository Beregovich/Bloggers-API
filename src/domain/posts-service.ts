import {NewPostType, postsRepository} from "../repositories/posts-db-repository";

export const postsService = {
    async getPosts() {
        return await postsRepository.getPosts()
    },
    async getPostById(id: number) {
        return await postsRepository.getPostById(id)
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