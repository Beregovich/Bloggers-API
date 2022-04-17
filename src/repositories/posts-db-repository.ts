import {bloggersCollection, postsCollection, PostType} from "./db";
import {bloggersRepository} from "./bloggers-db-repository";

export const postsRepository = {

    async getPosts() {
        const allPosts: PostType[] = await postsCollection.find().toArray()
        return allPosts
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id: id})
        if(!post) return false
        const blogger = await bloggersRepository.getBloggerById(post.bloggerId)
        if(!blogger) return false
            delete post._id
            return ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: blogger.name
            })
    },
    async createPost(newPost: PostType) {
        const blogger = await bloggersCollection.findOne({id: newPost.bloggerId})
        await postsCollection.insertOne({
            ...newPost,
            bloggerName: blogger.name
        })
        const postToReturn = await postsCollection.findOne({id: newPost.id})
        delete postToReturn._id
        return   (postToReturn)
    },
    async updatePostById (newPost: PostType) {
        const id = newPost.id
        const result = await postsCollection.updateOne({id}, {$set:{
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            bloggerId: newPost.bloggerId
        }})
       return result.modifiedCount === 1
    },

    async deletePostById(id: number) {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async getPostsByBloggerId(bloggerId: number){
        return await postsCollection.find({bloggerId}).toArray()
    }
}