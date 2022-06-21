import {v4 as uuidv4} from "uuid";
import {EntityWithPaginationType, PostType} from "../types/types";
import {inject, injectable} from "inversify";
import {PostsRepository} from "../repositories/mongoose/posts-mongoose-repository";
import {TYPES} from "../iocTYPES";
import {IBloggersRepository} from "./bloggers-service";

@injectable()
export class PostsService {
    constructor(@inject<IPostsRepository>(TYPES.IPostsRepository) private postsRepository: IPostsRepository) {
    }
    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        const postsToSend = await this.postsRepository.getPosts(page, pageSize, searchNameTerm, bloggerId)
        return postsToSend
    }
    async getPostById(id: string): Promise<PostType | false> {
        const post = await this.postsRepository.getPostById(id)
        if (post) {
            return post
        } else return false
    }
    async createPost(newPostData: PostType): Promise<PostType | null> {
        const postToCreate = {
            ...newPostData,
            id: uuidv4(),
        }
        return await this.postsRepository.createPost(postToCreate)

    }
    async updatePostById(id: string, newPost: PostType) {
        return await this.postsRepository.updatePostById(id, newPost)
    }
    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}
export interface IPostsRepository {
    getPosts(page: number,
             pageSize: number,
             searchNameTerm: string,
             bloggerId: string | null): Promise<EntityWithPaginationType<PostType[]>>,
    getPostById(id: string): Promise<PostType | false>,
    createPost(newPostData: PostType): Promise<PostType | null>,
    updatePostById(id: string, newPost: PostType): any,
    deletePostById(id: string): Promise<boolean>
}
