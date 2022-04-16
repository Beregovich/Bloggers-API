import {bloggers, posts, PostType} from "./db";

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
        const postsWithNames: PostType[] = [];
        await posts.forEach(p => {
            postsWithNames.push({
                ...p,
                bloggerName: bloggers.find(b => b.id === p.blogId)?.name
            })
        })
        return postsWithNames
    },
    async getPostById(id: number) {
        const post = await posts.find(p => p.id === id)
        if (post) {
            return {
                ...post,
                bloggerName: bloggers.find(b => b.id === id)?.name
            }
        } else return false
    },

    async createPost(newPost: PostToPushType) {
        await posts.push(newPost)
        return newPost
    },

    async updatePostById (newPost: PostToPushType) {
        const post = await posts.find(p => p.id === newPost.id)
        if(post){
            post.title = newPost.title
            post.shortDescription = newPost.shortDescription
            post.content = newPost.content
            return post
        }else return false
    },

    async deletePostById(id: number) {
        const PostToDel = posts.find(p => p.id === id)
        if (PostToDel) {
            posts.splice(posts.indexOf(PostToDel), 1)
            return true
        } else {
            return false
        }
    }
}