import "reflect-metadata";
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {iocContainer} from "../IocContainer";
import {BloggersService} from "./bloggers-service";
import {TYPES} from "../iocTYPES";

describe("Integration BloggersService-s tests", () => {
    const bloggersService = iocContainer.get<BloggersService>(TYPES.BloggersService)
    let mongoServer: MongoMemoryServer
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
        return console.log('mongoose memory server up')
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongoServer.stop()
        return console.log('mongoose memory server down')
    })

    let bloggerId: string;
    describe("Create blogger", () => {
        it("should return new blogger", async () => {
            const newBlogger = await bloggersService.createBlogger("Vasya", "https://youtube.com")
            expect(newBlogger.name).toBe("Vasya")
            expect(newBlogger.youtubeUrl).toBe("https://youtube.com")
            bloggerId = newBlogger.id
        })
        it("should return blogger", async () => {
            const blogger = await bloggersService.getBloggerById(bloggerId)
            expect(blogger).not.toBe(null)
            if (blogger) {
                expect(blogger.name).toBe("Vasya")
                expect(blogger.youtubeUrl).toBe("https://youtube.com")
            }

        })
        it("should return array of bloggers", async ()=>{
            const bloggers = await bloggersService.getBloggers(1, 10, "")
            expect(typeof bloggers).toBe(typeof [])
        })
        it("Should return array with length = 0", async ()=>{
            await bloggersService.deleteBloggerById(bloggerId)
            const bloggers = await bloggersService.getBloggers(1, 10, "")
            expect(bloggers.items.length).toBe(0)
        })
    })
})

