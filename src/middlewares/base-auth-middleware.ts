import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";

export const checkHeaders = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization || typeof req.headers.authorization != 'string'
         ){
        res.sendStatus(401)
        return
    }else if(!req.headers.authorization.split(" ")[1]
        || req.headers.authorization.split(" ")[1]=="admin:qwerty"
        || req.headers.authorization.split(" ")[0]!="Basic"){
        res.sendStatus(401)
        return
    }
    next()
}

export const baseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   // const password = typeof req.query.password === 'string' ? req.query.password : ""
   // const login = typeof req.query.login === 'string' ? req.query.login : ""

    try{
        let authorizationHeader = req.headers.authorization
        let authorizationData = ""
        let authorizationDecoded = ""
        if(authorizationHeader){
            authorizationData = authorizationHeader.split(" ")[1]
            if(!authorizationData){
                res.sendStatus(401)
                return
            }
            authorizationDecoded =  Buffer.from(authorizationData, 'base64').toString()

        }else {
            res.sendStatus(401)//400
        }
        const login = authorizationDecoded.split(":")[0]
        const password = authorizationDecoded.split(":")[1]
        const result = await usersService.checkCredentials(login, password)
        if(result.resultCode === 1){
            res.sendStatus(401)
        }else{
            next()
        }
    }catch (e) {
        console.log(e)
        res.sendStatus(401)
    }

}