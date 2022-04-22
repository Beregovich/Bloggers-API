import { postsRepository} from "../repositories/posts-db-repository";
import {PostType} from "../repositories/db";

export const postsService = {
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: number | null) {
        const postsToSend = await postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsToSend
    },
    async getPostById(id: number): Promise<PostType | false> {
        const post = await postsRepository.getPostById(id)
        if(post){
            return post
        }else return false
    },
    async createPost(newPostData: PostType): Promise<PostType> {
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
    }
}