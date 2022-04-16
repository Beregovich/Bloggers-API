import {bloggersCollection, postsCollection, PostType} from "./db";
import {bloggersRepository} from "./bloggers-db-repository";

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
        const allPosts: PostType[] = await postsCollection.find().toArray()
        const allPostsWithNames = allPosts.map(p=>({
            id: p.id,
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            bloggerName: "Prohor"
            //bloggerName: bloggersCollection.findOne({id: p.bloggerId}).name
        }))
        return allPostsWithNames
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id: id})
        const blogger = await bloggersRepository.getBloggerById(post.blogId)
        if(!blogger) return false
        if (post) {
            delete post._id
            return ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                bloggerName: blogger.name
            })
        } else return false
    },
    async createPost(newPost: PostToPushType) {
        await postsCollection.insertOne(newPost)
        const postToReturn = await postsCollection.findOne({id: newPost.id})
        delete postToReturn._id
        return   ({
            id: postToReturn.id,
            title: postToReturn.title,
            shortDescription: postToReturn.shortDescription,
            content: postToReturn.content,
            blogId: postToReturn.blogId,
            bloggerName: await bloggersCollection.findOne({id: postToReturn.bloggerId})
        })
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
        return result.deletedCount === 1
    }
}