import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {UserType} from "../types/types";
import {usersRepository} from "../IoCContainer";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
        const secretKey = process.env.JWT_SECRET_KEY
        const decoded: any = jwt.verify(token, secretKey!)
        const user: UserType | null = await usersRepository.findUserById(decoded.userId)
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
