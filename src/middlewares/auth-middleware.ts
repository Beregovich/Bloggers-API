import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {commentsRepository} from "../repositories/users-db-repository";
import {ObjectId} from "mongodb";
import {UserType} from "../repositories/db";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const authorizationData = req.headers.authorization.split(" ")
    const token = authorizationData[1]
    const tokenName = authorizationData[0]
    if (tokenName!="Bearer") {
        res.send(401)
        return
    }
    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "NoAnySecretsAtAll")
        const user: UserType = await commentsRepository.findUserById(new ObjectId(decoded.userId))
        req.user = user
    } catch (e) {
        console.log(e)
        res.send(401)
        return
    }
    next()
}