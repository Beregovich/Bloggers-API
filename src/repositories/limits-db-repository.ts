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

    async addAttempt(ip: string, url: string, time: Date ) {
        let result = await this.limitsCollection.insertOne({
            userIp: ip,
            url,
            time
        })
        return result.insertedId
    }
    async removeOldAttempts() {
        let result = await this.limitsCollection.deleteMany({})
        return result.deletedCount
    }
    async getLastAttempts(ip: string, url: string, limitTime: Date){
        const countAttempts = await this.limitsCollection.countDocuments({
            userIp: ip,
            url,
            time: {$gt: limitTime}
        })
        return countAttempts
    }
    /*
    async getLimitsByIp(ip: string): Promise<any> {
        const limits = await this.limitsCollection
            .find()
            .project<LimitsControlType>({_id: 0})
            .toArray()
        return limits
    }

    async updateSentEmailsByIp(ip: string, date: Date) {
        const result = await this.limitsCollection.updateOne({ip},
            {
                $push: {"sentEmailsAt": date},
                $set: {lastChangingAt: date}
            },
            {upsert: true})
        return result.modifiedCount === 1
    }

    async updateAuthAttemptsByIp(ip: string, date: Date) {
        const result = await this.limitsCollection.updateOne({ip},
            {
                $push: {"authAttemptsAt": date},
                $set: {lastChangingAt: date}
            },
            {upsert: true})
        return result.modifiedCount === 1
    }*/

}



