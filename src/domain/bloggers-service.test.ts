// import {MongoMemoryServer} from "mongodb-memory-server";
// import mongoose from "mongoose";
// import {iocContainer} from "../IocContainer";
// import {BloggersService} from "./bloggers-service";
// import {TYPES} from "../iocTYPES";
//
// describe("Integration BloggersService-s tests",()=>{
//     let mongoServer: MongoMemoryServer;
//     beforeAll(async ()=>{
//         mongoServer = await MongoMemoryServer.create()
//         const mongoUri = mongoServer.getUri()
//         await mongoose.connect(mongoUri)
//     })
//     afterAll(async ()=>{
//         await mongoose.disconnect()
//         await mongoServer.stop()
//     })
//     const bloggersService = iocContainer.get<BloggersService>(TYPES.BloggersService)
//
//     describe("Create blogger", ()=>{
//         it("should return new blogger",async ()=>{
//             const newBlogger = await bloggersService.createBlogger("Vasya", "https://youtube.com")
//             expect(newBlogger.name).toBe("Vasya")
//             expect(newBlogger.youtubeUrl).toBe("https://youtube.com")
//         })
//     })
// })
//
