import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {iocContainer} from "../IocContainer";
import {TYPES} from "../iocTYPES";
import {PostsService} from "./posts-service";

describe("Integration PostsService-s tests",()=>{
    let mongoServer: MongoMemoryServer;
    beforeAll(async ()=>{
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()
        await mongoose.connect(mongoUri)
    })
    afterAll(async ()=>{
        await mongoose.disconnect()
        await mongoServer.stop()
    })
    const postsService = iocContainer.get<PostsService>(TYPES.PostsService)

    describe("Create post", ()=>{
        it("should return new post",async ()=>{

        })
    })
})

