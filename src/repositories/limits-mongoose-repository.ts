import * as MongoClient from 'mongodb';
import "reflect-metadata";
import {LimitsControlType} from "../types/types";
import {inject, injectable} from "inversify";
import {ILimitsRepository} from "../middlewares/limit-control-middleware";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {TYPES} from "../iocTYPES";

@injectable()
export class LimitsRepository implements ILimitsRepository {
    constructor(@inject(TYPES.limitsModel)private limitsModel: mongoose.Model<LimitsControlType>) {
    }

    async addAttempt(ip: string, url: string, time: Date) {
        let result = await this.limitsModel.insertMany([{
            userIp: ip,
            url,
            time
        }])
        return new ObjectId()
    }

    async removeOldAttempts() {
        let result = await this.limitsModel.deleteMany({})
        return result.deletedCount
    }

    async getLastAttempts(ip: string, url: string, limitTime: Date) {
        const countAttempts = await this.limitsModel.countDocuments({
            userIp: ip,
            url,
            time: {$gt: limitTime}
        })
        return countAttempts
    }
}



