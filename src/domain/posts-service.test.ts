import "reflect-metadata"
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {iocContainer} from "../IocContainer";
import {TYPES} from "../iocTYPES";
import {PostsService} from "./posts-service";
import {BloggerType, PostType} from "../types/types";
import {BloggersService} from "./bloggers-service";
import {v4 as uuidv4} from "uuid";

describe("Integration PostsService-s tests", () => {
    const bloggersService = iocContainer.get<BloggersService>(TYPES.BloggersService)
    const postsService = iocContainer.get<PostsService>(TYPES.PostsService)
    let mongoServer: MongoMemoryServer;
    let blogger: BloggerType
    let postToCreate: PostType
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
        blogger = await bloggersService.createBlogger("Vasya", "https://youtube.com")
        console.dir(blogger)
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
    })

    it("should create blogger for testing posts", () => {
        expect(blogger).not.toBeUndefined()
        console.dir(blogger)
    })

    it("Should return created post", async () => {
        postToCreate = {
            bloggerId: blogger.id,
            id: uuidv4(),
            bloggerName: blogger.name,
            content: "Content",
            shortDescription: "short Description",
            title: "title"
        }
        const newPost = await postsService.createPost(postToCreate)
        expect(newPost!.id).toBe(postToCreate.id)
        expect(newPost!.bloggerId).toBe(postToCreate.bloggerId)
        expect(newPost!.bloggerName).toBe(postToCreate.bloggerName)
        expect(newPost!.content).toBe(postToCreate.content)
        expect(newPost!.shortDescription).toBe(postToCreate.shortDescription)
        expect(newPost!.title).toBe(postToCreate.title)

        const post = await postsService.getPostById(postToCreate.id!)
        expect(post).not.toBe(false)
        if (post) {
            expect(post!.id).toBe(postToCreate.id)
            expect(post!.bloggerId).toBe(postToCreate.bloggerId)
            expect(post!.bloggerName).toBe(postToCreate.bloggerName)
            expect(post!.content).toBe(postToCreate.content)
            expect(post!.shortDescription).toBe(postToCreate.shortDescription)
            expect(post!.title).toBe(postToCreate.title)
        }
    })
    it("Should return post", async () => {

    })

})

