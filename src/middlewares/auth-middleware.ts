import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserType} from "../repositories/db";
import {commentsRepository} from "../repositories/comments-db-repository";
import {usersRepository} from "../repositories/users-db-repository";
import {format} from "date-fns";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const newRequest = {
        "date": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        "method": req.method,
        "baseUrl": req.baseUrl,
        "body": req.body,
        "params": req.params,
        "url": req.url,
        "authorization": req.headers.authorization
    }
    console.log("\n=======\n======\n=====\n====\n===\n====\n=====\n======\n=======")
    console.log(newRequest)
    console.log("\n=======\n======\n=====\n====\n===\n====\n=====\n======\n=======")
    if (!req.headers || !req.headers.authorization) {
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
        const decoded: any = jwt.verify(token, "topSecretKey")
        const user: UserType = await usersRepository.findUserById(decoded.userId)
        if(!user){
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
