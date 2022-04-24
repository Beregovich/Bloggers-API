import {Request, Response, Router} from 'express'

import {usersService} from "../domain/users-service";


export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const checkResult = await usersService.checkCredentials(req.body.username, req.body.password)
        if (checkResult.resultCode === 0) {
            res.status(201).send(checkResult.data)
        } else {
            res.sendStatus(401)
        }
    })