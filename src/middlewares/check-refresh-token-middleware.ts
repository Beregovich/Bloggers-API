import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserType} from "../types/types";
import {TYPES} from "../iocTYPES";
import {IUsersRepository} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-mongoose-repository";
import {inject, injectable} from "inversify";

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
                res.status(404).send("user from jwt data not found\n")
                return
            } else if (user.accountData.revokedTokens?.includes(token)) {
                return res.sendStatus(401)
            }
            req.user = user
            res.locals.userData = user
        } catch (e) {
            console.log(e)
            return res.sendStatus(401)
        }
        next()
    }
}

