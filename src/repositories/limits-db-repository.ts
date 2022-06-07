import {limitsCollection} from "./db";
import * as MongoClient from 'mongodb';

import { LimitsControlType} from "../types/types";
import {injectable} from "inversify";
import {ILimitsRepository} from "../application/limit-control-service";

@injectable()
export class LimitsRepository  implements ILimitsRepository{
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
    async updateSentEmailsById(id: string, date: Date) {
        const result = await this.limitsCollection.updateOne({id},
            {
                $push: {
                    "sentEmailsAt": date,
                }
            })
        return result.modifiedCount === 1
    }
    async updateAuthAttempts(id: string, date: Date) {
        const result = await this.limitsCollection.updateOne({id},
            {
                $push: {
                    "authAttemptsAt": date,
                }
            })
        return result.modifiedCount === 1
    }

}

export const limitsRepository = new LimitsRepository(limitsCollection)
