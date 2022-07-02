// import {MongoMemoryServer} from "mongodb-memory-server";
// import mongoose from "mongoose";
// import {iocContainer} from "../IocContainer";
// import {TYPES} from "../iocTYPES";
// import {UsersService} from "./users-service";
// import {AuthService} from "./auth-service";
// const usersService = iocContainer.get<UsersService>(TYPES.UsersService)
// const authService = iocContainer.get<AuthService>(TYPES.AuthService)
//
// describe("Integration Auth Services and middlewares tests",()=>{
//     let mongoServer: MongoMemoryServer;
//     const userLogin = "Zahar"
//     const userPassword = "1234"
//     const userEmail = "1234@mail.com"
//     let firstAccessToken: string | undefined| null;
//     let firstRefreshToken: string | undefined | null;
//     let newAccessToken: string | undefined| null;
//     let newRefreshToken: string | undefined | null;
//     let userId: string;
//     beforeAll(async ()=>{
//         mongoServer = await MongoMemoryServer.create()
//         const mongoUri = mongoServer.getUri()
//         await mongoose.connect(mongoUri)
//
//     })
//     afterAll(async ()=>{
//         await mongoose.disconnect()
//         await mongoServer.stop()
//     })
//
//
//     describe("Create user", ()=>{
//         it("should return new user",async ()=>{
//             const newUser = await usersService.createUser(userLogin, userPassword,userEmail)
//             expect(newUser?.accountData.login).toBe(userLogin)
//             expect(newUser?.accountData.id).not.toBeUndefined()
//             if(newUser?.accountData)userId = newUser?.accountData.id
//         })
//     })
//     describe("Auth service", ()=>{
//         it("should return result code 0 and tokens pair",async ()=>{
//             const result = await authService.checkCredentials(userLogin, userPassword)
//             expect(result.resultCode).toBe(0)
//             expect(result.data.refreshToken).not.toBeUndefined()
//             expect(result.data.accessToken).not.toBeUndefined()
//             firstAccessToken = result.data.accessToken
//             firstRefreshToken = result.data.accessToken
//         })
//         it("should return new tokens pair  ",async ()=>{
//             const newTokensPair = authService.createJwtTokensPair(userId)
//             newAccessToken = newTokensPair.accessToken
//             newRefreshToken = newTokensPair.refreshToken
//             expect(newAccessToken).not.toBeUndefined()
//             expect(newRefreshToken).not.toBeUndefined()
//             setTimeout(()=>{
//                 expect(newAccessToken).not.toBe(firstAccessToken)
//                 expect(newRefreshToken).not.toBe(firstRefreshToken)
//             },1000)
//
//         })
//     })
// })
//
