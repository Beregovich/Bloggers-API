import 'dotenv/config'

const {MongoClient} = require('mongodb');

const mongoUri = process.env.mongoURI
export const client = new MongoClient(mongoUri)
export const bloggersCollection = client.db("bloggersDB").collection("bloggers")
export const postsCollection = client.db("bloggersDB").collection("posts")
export const requestCollection = client.db("bloggersDB").collection("requests")
export const usersCollection = client.db("bloggersDB").collection("users")
export const commentsCollection = client.db("bloggersDB").collection("comments")
export const limitsCollection = client.db("bloggersDB").collection("limits")
export const emailToSendQueueCollection = client.db("bloggersDB").collection("emailsToSend")


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

