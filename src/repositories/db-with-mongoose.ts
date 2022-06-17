import 'dotenv/config'
import mongoose from 'mongoose'
//const {MongoClient} = require('mongodb');
import {
    BloggerType, CheckLimitsType,
    CommentType, EmailConfirmationMessageType, EmailConfirmationType,
    LimitsControlType,
    PostType, SentConfirmationEmailType, UserAccountType,
    UserType
} from "../types/types";


const mongoUri = process.env.mongoURI || ""

//Schemas
const bloggersSchema = new mongoose.Schema<BloggerType>({
    id: String,
    name: String,
    youtubeUrl: String,
})

const postsSchema = new mongoose.Schema<PostType>({
    id: String,
    title: [String, null],
    shortDescription: [String, null],
    content: [String, null],
    bloggerId: String,
    bloggerName: [String, null]
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

const commentsSchema = new mongoose.Schema<CommentType>({
    id: String,
    content: String,
    postId: String,
    userId: String,
    userLogin: String,
    addedAt: Date,
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
export const bloggersModel = mongoose.model('Bloggers', bloggersSchema)
export const postsModel = mongoose.model('Posts', postsSchema)
export const usersModel = mongoose.model('Users', usersSchema)
export const commentsModel = mongoose.model('Comments', commentsSchema)
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

