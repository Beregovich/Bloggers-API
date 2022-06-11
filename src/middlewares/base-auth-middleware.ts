import {NextFunction, Request, Response} from "express";

export const checkHeaders = async (req: Request, res: Response, next: NextFunction) => {
    const exceptedAuthInput = "Basic YWRtaW46cXdlcnR5"
    if(!req.headers || !req.headers.authorization){
        res.sendStatus(401)
    }else{
        if(req.headers.authorization != exceptedAuthInput) return res.sendStatus(401)
        next()
    }}

export const baseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    next()
    return
}