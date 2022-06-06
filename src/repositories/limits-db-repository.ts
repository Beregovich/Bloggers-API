import {bloggersCollection, postsCollection} from "./db";
import * as MongoClient from 'mongodb';
import {IBloggersRepository} from "../domain/bloggers-service";
import {BloggerType, EntityWithPaginationType, LimitsControlType, PostType} from "../types/types";
import {injectable} from "inversify";

export class LimitsRepository  {
    constructor(private limitsCollection: MongoClient.Collection<LimitsControlType>) {
    }
    async getLimitsById(id: string): Promise<any> {
        const limits = await this.limitsCollection
            .find()
            .project<LimitsControlType>({_id: 0})
            .toArray()
        return limits
    }

    async createLimits(id: string) {
        let result = await this.limitsCollection.insertOne({
            userId: id,
            authAttemptsAt: [],
            sentEmailsAt: [],

        })
    }
    async updateSentEmailsById(id: string) {
        const result = await this.limitsCollection.updateOne({id},
            {
                $push: {
                    "sentEmailsAt": new Date(),
                }
            })
        return result.modifiedCount === 1
    }
    async updateAuthAttempts(id: string) {
        const result = await this.limitsCollection.updateOne({id},
            {
                $push: {
                    "authAttemptsAt": new Date(),
                }
            })
        return result.modifiedCount === 1
    }

}


