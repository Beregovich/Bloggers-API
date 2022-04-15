import {NextFunction, Request, Response} from "express";
import {client, requestCollection} from "../repositories/db";

export const requestsSaverMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date()
    const dateNow = `${date.getFullYear()}.${date.getMonth()},${date.getDate()} - ${date.getHours()}:${date.getMinutes()}`
    const newRequest = {
        "date": dateNow,
        "method": req.method,
        "baseUrl": req.baseUrl,
        "body": req.body,
        "params": req.params,
        "url": req.url
    }
    await requestCollection.insertOne(newRequest)
    next()
}