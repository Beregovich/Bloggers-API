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
   /* try {
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
    }*/
}