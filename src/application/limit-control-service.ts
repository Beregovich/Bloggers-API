import {injectable} from "inversify";
import {LimitsControlType} from "../types/types";
import {LimitsRepository} from "../repositories/limits-db-repository";

@injectable()
export class LimitsControl {
    constructor(private limitsRepository: LimitsRepository) {
    }

    private limitInterval = 5 * 60 * 1000 //5min  60sec 1000ms
    async checkAuthLimits(id: string) {
        const dateInLimit: Date = new Date()
        dateInLimit.setDate(dateInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsById(id)
        const attempts = limits.authAttemptsAt.filter(date => date > dateInLimit)
        return attempts.length < 50
    }

    async checkSentEmailsLimits(id: string) {
        const dateInLimit: Date = new Date()
        dateInLimit.setDate(dateInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsById(id)
        const attempts = limits.sentEmailsAt.filter(date => date > dateInLimit)
        return attempts.length < 5
    }

    async addAuthAttemptDate(id: string) {
        const date = new Date()
        await this.limitsRepository.updateSentEmailsById(id, date)
    }

    async addSentEmailDate(id: string) {
        const date = new Date()
        await this.limitsRepository.updateSentEmailsById(id, date)
    }
}

export interface ILimitsRepository {
    getLimitsById(id: string): Promise<LimitsControlType>

    createLimits(id: string): void

    updateSentEmailsById(id: string, date: Date): Promise<boolean>

    updateAuthAttempts(id: string, date: Date): Promise<boolean>
}
