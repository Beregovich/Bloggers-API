import {Request, Response, Router} from 'express'
import {usersService} from "../domain/users-service";
import {authService} from "../domain/auth-service";
import {limitsControl} from "../middlewares/limit-control-middleware";

export const authRouter = Router({})
authRouter
    .post('/registration',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const user = await usersService.createUser(req.body.login, req.body.password)
            res.status(201).send(user)
        })
    .post('/login',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const checkResult = await authService.checkCredentials(req.body.login, req.body.password)
            if (checkResult.resultCode === 0) {
                res.status(200).send(checkResult.data)
            } else {
                res.sendStatus(401)
            }
        })
    .post('/registration-confirmation',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const ip = req.ip
            const result = await authService.confirmEmail(req.body.code, req.body.email)
            if (result) {
                res.status(201).send()
            } else {
                res.sendStatus(400)
            }
        })
    .post('/registration-email-resending',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            let isReseeded = authService.resendCode(req.body.email)
            if(!isReseeded) return null
            res.sendStatus(200)
        })