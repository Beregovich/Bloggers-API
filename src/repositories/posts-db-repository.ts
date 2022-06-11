import {postsCollection} from "./db";
import {BloggersRepository} from "./bloggers-db-repository";
import {IPostsRepository} from "../domain/posts-service";
import {BloggerType, PostType} from "../types/types";
import * as MongoClient from 'mongodb';
import {injectable} from "inversify";

@injectable()
export class PostsRepository implements IPostsRepository {
    constructor(private postsCollection: MongoClient.Collection<PostType>,
                private bloggersCollection: MongoClient.Collection<BloggerType>,
                private bloggersRepository: BloggersRepository) {
    }

    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: string | null) {
        let filter = bloggerId
            ? {title: {$regex: searchNameTerm ? searchNameTerm : ""}, bloggerId}
            : {title: {$regex: searchNameTerm ? searchNameTerm : ""}}
        const totalCount = await this.postsCollection.countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pageSize)
        const allPosts = await this.postsCollection
            .find(filter)
            .project<PostType>({_id: 0})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return ({
            pagesCount,
            page,
            pageSize,
            totalCount,
            items: allPosts
        })
    }

    async getPostById(id: string) {
        const post = await this.postsCollection.findOne({id}, {projection: {_id: 0}})
        if (!post) return false
        const blogger = await this.bloggersRepository.getBloggerById(post.bloggerId)
        if (!blogger) return false
        const bloggerName = blogger.name
        return ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName
        })
    }

    async createPost(newPost: PostType): Promise<PostType | null> {
        const blogger = await this.bloggersCollection.findOne({id: newPost.bloggerId})
        if (!blogger) return null
        await postsCollection.insertOne({
            ...newPost,
            bloggerName: blogger.name
        })
        const postToReturn = await this.postsCollection.findOne({id: newPost.id}, {projection: {_id: 0}})
        return (postToReturn)
    }

    async updatePostById(id: string, newPost: PostType) {
        const result = await this.postsCollection.updateOne({id}, {
            $set: {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                bloggerId: newPost.bloggerId
            }
        })
        return result.modifiedCount === 1
    }

    async deletePostById(id: string) {
        const result = await this.postsCollection.deleteOne({id})
        return result.deletedCount === 1
    }
}

