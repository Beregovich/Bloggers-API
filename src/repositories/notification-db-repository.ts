import {EmailConfirmationMessageType} from "../types/types";
import * as MongoClient from 'mongodb';
import {ObjectId} from 'mongodb';
import {injectable} from "inversify";

@injectable()
export class NotificationRepository {
    constructor(private emailToSendQueueCollection: MongoClient.Collection<EmailConfirmationMessageType>) {
    }

    async enqueueMessage(message: EmailConfirmationMessageType) {
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


