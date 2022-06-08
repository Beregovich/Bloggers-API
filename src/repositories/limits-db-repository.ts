import {limitsCollection} from "./db";
import * as MongoClient from 'mongodb';
import "reflect-metadata";
import {LimitsControlType} from "../types/types";
import {injectable} from "inversify";
import {ILimitsRepository} from "../middlewares/limit-control-middleware";

@injectable()
export class LimitsRepository implements ILimitsRepository {
    constructor(private limitsCollection: MongoClient.Collection<LimitsControlType>) {
    }

    async getLimitsByIp(id: string): Promise<any> {
        const limits = await this.limitsCollection
            .find()
            .project<LimitsControlType>({_id: 0})
            .toArray()
        return limits
    }

    async createLimits(ip: string) {
        let result = await this.limitsCollection.insertOne({
            userIp: ip,
            authAttemptsAt: [],
            sentEmailsAt: [],
            lastChangingAt: new Date()
        })
    }

    async updateSentEmailsById(ip: string, date: Date) {
        const result = await this.limitsCollection.updateOne({ip},
            {
                $push: {"sentEmailsAt": date},
                $set: {lastChangingAt: date}
            })
        return result.modifiedCount === 1
    }

    async updateAuthAttempts(ip: string, date: Date) {
        const result = await this.limitsCollection.updateOne({ip},
            {
                $push: {"authAttemptsAt": date},
                $set: {lastChangingAt: date}
            },
            {upsert: true})
        return result.modifiedCount === 1
    }

}


