import {NextFunction, Request, Response} from "express";
import {usersService} from "../domain/users-service";


export const baseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const password = req.body.password
    const login = req.body.login
    const result = await usersService.checkCredentials(login, password)
    if(result.resultCode === 1){
        res.sendStatus(401)
    }else{
        next()
    }
}