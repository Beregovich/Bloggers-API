import {bloggers, posts, PostType} from "./db";

type NewPostType = {
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
}

export const getPosts = () => {
    const postsWithNames: PostType[] = [];
    posts.forEach(p => {
        postsWithNames.push({
            ...p,
            bloggerName: bloggers.find(b => b.id === p.blogId)?.name
        })
    })
    return postsWithNames
}


export const getPostById = (id: number) => {
    const post = posts.find(p => p.id === id)
    if (post) {
        return {
            ...post,
            bloggerName: bloggers.find(b => b.id === id)?.name
        }
    } else return false
}

export const createPost = (newPost: NewPostType) => {
    const postToPush = {
        id: +(new Date()),
        ...newPost
    }
    posts.push(postToPush)
    return postToPush
}

export const updatePostById = (newPost: NewPostType) => {
    const post = posts.find(p => p.id === newPost.blogId)
    if(post){
        post.title = newPost.title
        post.shortDescription = newPost.shortDescription
        post.content = newPost.content
        return post
    }
}

export const deletePostById = (id: number) => {
    const PostToDel = posts.find(p => p.id === id)
    if (PostToDel) {
        posts.splice(posts.indexOf(PostToDel), 1)
        return true
    } else {
        return false
    }
}