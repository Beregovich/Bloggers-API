import 'dotenv/config'
import {injectable} from "inversify";
const {MongoClient} = require('mongodb');

export const getPaginationData = (query: any) => {
    const page = typeof query.PageNumber === 'string' ? +query.PageNumber : 1
    const pageSize = typeof query.PageSize === 'string' ? +query.PageSize : 10
    const searchNameTerm = typeof query.SearchNameTerm === 'string' ? query.SearchNameTerm : ""
    return {page, pageSize, searchNameTerm}
}

const mongoUri = process.env.mongoURI
export const client = new MongoClient(mongoUri)
export const bloggersCollection = client.db("bloggersDB").collection("bloggers")
export const postsCollection = client.db("bloggersDB").collection("posts")
export const requestCollection = client.db("bloggersDB").collection("requests")
export const usersCollection = client.db("bloggersDB").collection("users")
export const commentsCollection = client.db("bloggersDB").collection("comments")

export async function runDb() {
    try {
        await client.connect()
        await client.db("bloggersDB").command({ping: 1})
        console.log("Connection complete")
    } catch (e) {
        await client.close()
        console.log("no connection")
    }
}

