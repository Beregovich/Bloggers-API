import {EmailConfirmationMessageType} from "../types/types";
import {ObjectId} from 'mongodb';
import {inject, injectable} from "inversify";
import mongoose from "mongoose";
import {TYPES} from "../iocTYPES";

@injectable()
export class NotificationRepository {
    constructor(@inject(TYPES.emailsQueueModel)
                private emailsQueueModel: mongoose.Model<EmailConfirmationMessageType>) {
    }

    async enqueueMessage(message: EmailConfirmationMessageType) {
        const result = await this.emailsQueueModel.create(message)
        return result.id
    }

    async dequeueMessage() {
        const message = await this.emailsQueueModel.findOne({isSent: false})
        return message
    }

    async updateMessageStatus(id: ObjectId) {
        const result = await this.emailsQueueModel.updateOne({_id: id}, {$set: {isSent: true}})
        return result.modifiedCount === 1
    }

}


