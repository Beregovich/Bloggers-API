import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {usersRepository} from "../repositories/users-db-repository";
import {ObjectId} from "mongodb";
import {UserType} from "../repositories/db";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.send(401)
        return
    }
    const token = req.headers.authorization.split(" ")[1]
    try {
        const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "NoAnySecretsAtAll")
        const user: UserType = await usersRepository.findUserById(new ObjectId(decoded.userId))
        req.user = user
    } catch (e) {
        console.log(e)
        res.send(401)
        return
    }
    next()
}