import 'dotenv/config'
const {MongoClient} = require('mongodb');

export type PostType = {
    id?: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    bloggerId: number;
    bloggerName?: string | null | undefined;
}

type BloggerType = {
    id: number;
    name: string | null;
    youtubeUrl: string | null;
}

const mongoUri =
    process.env.mongoURI

export const client = new MongoClient(mongoUri)
export const bloggersCollection = client.db("bloggersDB").collection("bloggers")
export const postsCollection = client.db("bloggersDB").collection("posts")
export const requestCollection = client.db("bloggersDB").collection("requests")

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

