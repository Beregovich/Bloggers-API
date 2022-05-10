import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {authService} from "../domain/auth-service";

export const checkHeaders = async (req: Request, res: Response, next: NextFunction) => {
    const exceptedAuthInput = "Basic "+Buffer.from("admin:qwerty", 'base64').toString()
    if(!req.headers || !req.headers.authorization){
        res.sendStatus(401)
    }else{
        if(req.headers.authorization != exceptedAuthInput) return res.sendStatus(401)
        next()
    }}
    /*if (!req.headers) {

        return
    } else if (!req.headers.authorization || typeof req.headers.authorization != 'string'
    ) {
        res.sendStatus(401)
        return
    } else if (!req.headers.authorization.split(" ")[1]
        || req.headers.authorization.split(" ")[1] == "admin:qwerty"
        || req.headers.authorization.split(" ")[0] != "Basic") {
        res.sendStatus(401)
        return
    }
    next()
}*/

export const baseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let authorizationHeader = req.headers.authorization
        let authorizationData = ""
        let authorizationDecoded = ""
        if (authorizationHeader) {
            authorizationData = authorizationHeader.split(" ")[1]
            if (!authorizationData || authorizationData.length!=2) {
                res.sendStatus(401)
                return
            }
            authorizationDecoded = Buffer.from(authorizationData, 'base64').toString()
        } else {
            res.sendStatus(401)//400
        }
        const login = authorizationDecoded.split(":")[0]
        const password = authorizationDecoded.split(":")[1]
        const hash = await authService._generateHash( "qwerty")
        const result = await authService._isPasswordCorrect(password, hash)
        if (!result || login!="admin") {
            res.sendStatus(401)
            return
        } else {
            next()
        }
    } catch (e) {
        console.log("Base auth middleware error:"+e)
        res.sendStatus(401)
    }
}