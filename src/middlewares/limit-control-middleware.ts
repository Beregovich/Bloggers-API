import {inject, injectable} from "inversify";
import {ErrorMessageType} from "../types/types";
import "reflect-metadata";
import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {LimitsRepository} from "../repositories/mongoose/limits-mongoose-repository";
import {TYPES} from "../iocTYPES";
import {UsersRepository} from "../repositories/mongoose/users-mongoose-repository";

@injectable()
export class LimitsControlMiddleware {
    constructor(@inject<LimitsRepository>(TYPES.LimitsRepository)
                private limitsRepository: LimitsRepository,
                @inject<UsersRepository>(TYPES.UsersRepository)
                private usersRepository: UsersRepository) {
    }

    private limitInterval = 10 * 1000 //10sec 1000ms

    async checkLimits(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip
        const url = req.url
        const currentTime: Date = new Date()
        const limitTime: Date = new Date(currentTime.getTime() - this.limitInterval)
        const countAttempts = await this.limitsRepository.getLastAttempts(ip, url, limitTime)
        await this.limitsRepository.addAttempt(ip, url, currentTime)
        if (countAttempts < 5) {
            next()
        } else {
            res.sendStatus(429)
        }
    }

    async checkUserExisting(req: Request, res: Response, next: NextFunction) {
        const login = req.body.login
        const email = req.body.email
        let errors: ErrorMessageType[] = [];
        const userWithExistingEmail = await this.usersRepository.findUserByEmail(email)
        const userWithExistingLogin = await this.usersRepository.findUserByLogin(login)
        if (userWithExistingEmail) errors.push({message: "email already exist", field: "email"});
        if (userWithExistingLogin) errors.push({message: "login already exist", field: "login"});
        if (errors.length < 1) return next()
        res.status(400).send({"errorsMessages": errors})
    }
}

export interface ILimitsRepository {
    addAttempt(ip: string, hostname: string, time: Date): Promise<ObjectId>

    removeOldAttempts(): Promise<number>

    getLastAttempts(ip: string, hostname: string, currentTime: Date): Promise<number>
}

