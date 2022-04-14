import {bloggersCollection, postsCollection, PostType} from "./db";

export type NewPostType = {
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
}

export type PostToPushType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
}

export const postsRepository = {

    async getPosts() {
        const postsWithNames: PostType[] = await postsCollection.find().toArray();
        return postsWithNames
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id: id})
        if (post) {
            return {
                ...post,
                bloggerName: await bloggersCollection.findOne({id: post.blogId})
            }
        } else return false
    },
    async createPost(newPost: PostToPushType) {
        await postsCollection.insertOne(newPost)
        return newPost
    },
    async updatePostById (newPost: PostToPushType) {
        const id = newPost.id
        const result = await postsCollection.updateOne({id}, {$set:{
            "title": newPost.title,
            "shortDescription": newPost.shortDescription,
            "content": newPost.content
        }})
       return result.modifiedCount === 1
    },

    async deletePostById(id: number) {
        const result = await postsCollection.deleteOne({id})
        return result.acknowledged === 1
    }
}