import {bloggersCollection, BloggerType, postsCollection, PostType} from "./db";
import {bloggersRepository} from "./bloggers-db-repository";

export const postsRepository = {

    async getPosts(page: number, pageSize: number, searchNameTerm: string, bloggerId: number | null) {
        let allPosts: PostType[] = []
        let filter = bloggerId
            ?{title : {$regex : searchNameTerm ? searchNameTerm : ""}, bloggerId }
            :{title : {$regex : searchNameTerm ? searchNameTerm : ""}}
        const totalCount = (await postsCollection.find(filter).toArray()).length
        const pagesCount = Math.ceil(totalCount / pageSize)
        allPosts = await postsCollection
            .find(filter)
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
    },
    async getPostById(id: number) {
        const post = await postsCollection.findOne({id: id})
        if (!post) return false
        const blogger = await bloggersRepository.getBloggerById(post.bloggerId)
        if (!blogger) return false
        const bloggerName = blogger.name
        delete post._id
        return ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName
        })
    },
    async createPost(newPost: PostType): Promise<PostType> {
        const blogger = await bloggersCollection.findOne({id: newPost.bloggerId})
        await postsCollection.insertOne({
            ...newPost,
            bloggerName: blogger.name
        })
        const postToReturn = await postsCollection.findOne({id: newPost.id})
        delete postToReturn._id
        return (postToReturn)
    },
    async updatePostById(newPost: PostType) {
        const id = newPost.id
        const result = await postsCollection.updateOne({id}, {
            $set: {
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                bloggerId: newPost.bloggerId
            }
        })
        return result.modifiedCount === 1
    },
    async deletePostById(id: number) {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async updatePostsByBloggerId(bloggerId: number, newName: string) {

        return await postsCollection.find({bloggerId}).toArray()
    }
}