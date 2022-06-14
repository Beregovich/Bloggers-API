import 'dotenv/config'
import mongoose from 'mongoose'
//const {MongoClient} = require('mongodb');
import {
    BloggerType, CheckLimitsType,
    CommentType, EmailConfirmationMessageType, EmailConfirmationType,
    EntityWithPaginationType,
    LimitsControlType,
    PostType, SentConfirmationEmailType, UserAccountType,
    UserType
} from "../types/types";


const mongoUri = process.env.mongoURI || ""

//Schemas
const bloggersSchema = new mongoose.Schema({
    id: String,
    name: String,
    youtubeUrl: String,
})
const bloggersWithPaginationSchema = new mongoose.Schema<EntityWithPaginationType<BloggerType>>({
    pagesCount: Number,
    page: Number,
    pageSize: Number,
    totalCount: Number,
    items: bloggersSchema
})
const postsSchema = new mongoose.Schema<PostType>({
    id: String,
    title: [String, null],
    shortDescription: [String, null],
    content: [String, null],
    bloggerId: String,
    bloggerName: [String, null]
})
const postsWithPaginationSchema = new mongoose.Schema<EntityWithPaginationType<PostType>>({
    pagesCount: Number,
    page: Number,
    pageSize: Number,
    totalCount: Number,
    items: postsSchema
})
const userAccountDataSchema = new mongoose.Schema<UserAccountType>({
    id: String,
    email: String,
    login: String,
    passwordHash: String,
    createdAt: Date
})
const userSentConfirmationEmailSchema = new mongoose.Schema<SentConfirmationEmailType>({
    sentDate: Date
})
const userEmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    isConfirmed: Boolean,
    confirmationCode: String,
    expirationDate: Date,
    sentEmails: userSentConfirmationEmailSchema
})
const usersSchema = new mongoose.Schema<UserType>({
    accountData: userAccountDataSchema,
    emailConfirmation: userEmailConfirmationSchema
})
const usersWithPaginationSchema = new mongoose.Schema<EntityWithPaginationType<UserType>>({
    pagesCount: Number,
    page: Number,
    pageSize: Number,
    totalCount: Number,
    items: usersSchema
})

const commentsSchema = new mongoose.Schema<CommentType>({
    id: String,
    content: String,
    postId: String,
    userId: String,
    userLogin: String,
    addedAt: Date,
})
const commentsWithPaginationSchema = new mongoose.Schema<EntityWithPaginationType<CommentType>>({
    pagesCount: Number,
    page: Number,
    pageSize: Number,
    totalCount: Number,
    items: commentsSchema
})
const limitsSchema = new mongoose.Schema<CheckLimitsType>({
    login: [String, null],
    userIp: String,
    url: String,
    time: Date
})
const emailsQueueSchema = new mongoose.Schema<EmailConfirmationMessageType>({
    email: String,
    message: String,
    subject: String,
    isSent: Boolean,
    createdAt: Date
})

//Models
export const bloggersModel = mongoose.model('Bloggers', bloggersWithPaginationSchema)
export const postsModel = mongoose.model('Posts', postsWithPaginationSchema)
export const usersModel = mongoose.model('Users', usersWithPaginationSchema)
export const commentsModel = mongoose.model('Comments', commentsWithPaginationSchema)
export const limitsModel = mongoose.model('Limits', limitsSchema)
export const emailsQueueModel = mongoose.model('EmailsQueue', emailsQueueSchema)

export async function runDb() {
    try {
        await mongoose.connect(mongoUri)
        const connectionId = mongoose.connection.id
        console.log("Mongoose connection complete with id: ", connectionId)
    } catch (e) {
        console.log("No connection, error: ", e)
    }
}

