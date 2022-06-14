import {
    bloggersCollection,
    commentsCollection, limitsCollection,
    postsCollection,
    requestCollection,
    usersCollection
} from "../repositories/db";

export async function removeAll(){
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await requestCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await limitsCollection.deleteMany({})
}