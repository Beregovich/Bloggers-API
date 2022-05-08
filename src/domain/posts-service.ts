import {postsRepository} from "../repositories/posts-db-repository";
import {PostType} from "../repositories/db";
import {ObjectId} from "mongodb";

export const postsService = {

    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const postsToSend = await postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsToSend
    },
    async getPostById(id: string): Promise<PostType | false> {
        const post = await postsRepository.getPostById(id)
        if (post) {
            return post
        } else return false
    },
    async createPost(newPostData: PostType): Promise<PostType | boolean> {
        const postToCreate = {
            ...newPostData,
            id: new ObjectId(),
        }
        return await postsRepository.createPost(postToCreate)

    },
    async updatePostById(id: string, newPost: PostType) {
        return await postsRepository.updatePostById({
            id: new ObjectId(id),
            ...newPost
        })
    },
    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    }
}