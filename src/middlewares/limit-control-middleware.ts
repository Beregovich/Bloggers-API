import {injectable} from "inversify";
import {LimitsControlType} from "../types/types";
import {LimitsRepository} from "../repositories/limits-db-repository";
import "reflect-metadata";

@injectable()
export class LimitsControlService {
    constructor(private limitsRepository: LimitsRepository) {
    }
    private limitInterval = 10 * 1000 //10sec 1000ms
    async checkAuthLimits(ip: string) {
        const dateInLimit: Date = new Date()
        dateInLimit.setDate(dateInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsByIp(ip)
        const attempts = limits.authAttemptsAt.filter(date => date > dateInLimit)
        return attempts.length <= 5
    }

    async checkSentEmailsLimits(ip: string) {
        const dateInLimit: Date = new Date()
        dateInLimit.setTime(dateInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsByIp(ip)
        const attempts = limits.sentEmailsAt.filter(date => date > dateInLimit)
        return attempts.length < 5
    }

    async addAuthAttemptDate(ip: string) {
        const date = new Date()
        await this.limitsRepository.updateSentEmailsById(ip, date)
    }

    async addSentEmailDate(ip: string) {
        const date = new Date()
        await this.limitsRepository.updateSentEmailsById(ip, date)
    }
}

export interface ILimitsRepository {
    getLimitsByIp(ip: string): Promise<LimitsControlType>

    createLimits(ip: string): void

    updateSentEmailsById(ip: string, date: Date): Promise<boolean>

    updateAuthAttempts(ip: string, date: Date): Promise<boolean>
}
