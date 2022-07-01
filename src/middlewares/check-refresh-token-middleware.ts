import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserType} from "../types/types";
import {TYPES} from "../iocTYPES";
import {IUsersRepository} from "../domain/users-service";
import {UsersRepository} from "../repositories/mongoose/users-mongoose-repository";
import {inject, injectable} from "inversify";
import {iocContainer} from "../IocContainer";



@injectable()
export class CheckRefreshTokenMiddleware {
    constructor(@inject<IUsersRepository>(TYPES.IUsersRepository)
                private usersRepository: UsersRepository) {
    }

    async checkToken(req: Request, res: Response, next: NextFunction) {
        try {
            const secretKey = process.env.JWT_SECRET_KEY
            const token = req.cookies.refreshToken
            const decoded: any = jwt.verify(token, secretKey!)
            const user: UserType | null = await this.usersRepository.findUserById(decoded.userId)
            if (!user) {
                res.status(404).send("user from jwt data not found")
                return
            }
            req.user = user
            res.locals.userData = user
        } catch (e) {
            console.log(e)
            res.send(401)
            return
        }
        next()
    }
}

