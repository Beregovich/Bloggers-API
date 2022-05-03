import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";


export const baseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const password = typeof req.query.password === 'string' ? req.query.password : ""
    const login = typeof req.query.login === 'string' ? req.query.login : ""

    const result = await usersService.checkCredentials(login, password)
    if(result.resultCode === 1){
        next()
        //res.sendStatus(401)
    }else{
        next()
    }
}