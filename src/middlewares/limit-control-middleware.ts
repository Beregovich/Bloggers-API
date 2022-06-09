import {injectable} from "inversify";
import {ErrorMessageType, LimitsControlType} from "../types/types";
import {LimitsRepository} from "../repositories/limits-db-repository";
import "reflect-metadata";
import {limitsRepository} from "../IoCContainer";
import {Request, Response, NextFunction} from "express";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-db-repository";

@injectable()
export class LimitsControlMiddleware {
    constructor(private limitsRepository: LimitsRepository) {
    }

    private limitInterval = 10 * 1000 //10sec 1000ms

    async checkLimits(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const url = req.url
        const currentTime: Date = new Date()
        const limitTime: Date = new Date(currentTime.getTime() - this.limitInterval)
        //limitTime.setTime(limitTime.getTime() - this.limitInterval)
        const countAttempts = await this.limitsRepository.getLastAttempts(ip, url, limitTime)
        await this.limitsRepository.addAttempt(ip, url, currentTime)
        if(countAttempts < 5){
            next()
        }else{
            res.sendStatus(429)
        }
    }

    async checkUserExisting(req: Request, res: Response, next: NextFunction){
        const login = req.body.login
        const email = req.body.email
        let errors: ErrorMessageType[] = [];
        const userWithExistingEmail = await usersRepository.findUserByEmail(email)
        const userWithExistingLogin = await usersRepository.findUserByEmail(login)
        if(userWithExistingEmail) errors.push({message: "email already exist",field: "email"})
        if(userWithExistingLogin) errors.push({message: "login already exist",field: "login"})
        if(errors.length === 0) return next()
        res.status(400).send({"errorsMessages": errors})
    }
    /*async checkAuthLimits(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const hostname = req.hostname
        const dateInLimit: Date = new Date()
        await this.limitsRepository.updateAuthAttemptsByIp(ip, dateInLimit)
        dateInLimit.setDate(dateInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsByIp(ip)
        if (!limits.authAttemptsAt) return next()
        const attempts = limits.authAttemptsAt.filter(date => date > dateInLimit)
        return attempts.length <= 5
            ? next()
            : res.sendStatus(429)
    }

    async checkSentEmailsLimits(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const timeInLimit: Date = new Date()
        await this.limitsRepository.updateSentEmailsByIp(ip, timeInLimit)
        timeInLimit.setTime(timeInLimit.getTime() - this.limitInterval)
        let limits: LimitsControlType = await this.limitsRepository.getLimitsByIp(ip)
        if (!limits.sentEmailsAt) return next()
        const attempts = limits.sentEmailsAt.filter(date => date > timeInLimit)
        return attempts.length <= 5
            ? next()
            : res.sendStatus(429)
    }*/


}
export interface ILimitsRepository {
    addAttempt(ip: string, hostname: string, time: Date): Promise<ObjectId>
    removeOldAttempts(): Promise<number>
    getLastAttempts(ip: string, hostname: string, currentTime: Date): Promise<number>
}
/*export interface ILimitsRepository {
    getLimitsByIp(ip: string): Promise<LimitsControlType>
    updateSentEmailsByIp(ip: string, date: Date): Promise<boolean>
    updateAuthAttemptsByIp(ip: string, date: Date): Promise<boolean>
}*/

export const limitsControl = new LimitsControlMiddleware(limitsRepository)
