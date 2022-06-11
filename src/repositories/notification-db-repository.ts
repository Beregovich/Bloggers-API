import {emailToSendQueueCollection} from "./db";
import {emailConfirmationType} from "../types/types";
import * as MongoClient from 'mongodb';

import {ObjectId} from "mongodb";

export class NotificationRepository {
    constructor(private emailToSendQueueCollection: MongoClient.Collection<emailConfirmationType>) {
    }

    async enqueueMessage(message: emailConfirmationType) {
        const result = await this.emailToSendQueueCollection.insertOne(message)
        return result.insertedId
    }

    async dequeueMessage() {
        const message = await this.emailToSendQueueCollection.findOne({isSent: false})
        return message
    }

    async updateMessageStatus(id: ObjectId) {
        const result = await this.emailToSendQueueCollection.updateOne({_id: id}, {$set: {isSent: true}})
        return result.modifiedCount === 1
    }

}

export const notificationRepository = new NotificationRepository(emailToSendQueueCollection)


