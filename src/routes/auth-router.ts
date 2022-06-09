import {Request, Response, Router} from 'express'
import {usersService} from "../domain/users-service";
import {authService} from "../domain/auth-service";
import {limitsControl} from "../middlewares/limit-control-middleware";
import {inputValidatorMiddleware, registrationValidationRules} from "../middlewares/input-validator-middleware";

export const authRouter = Router({})
authRouter
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
    .post('/registration',
        //registrationValidationRules,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
            res.sendStatus(204)
        })
    .post('/registration-confirmation',
        //registrationValidationRules,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const code = req.body.code || req.query.code
            const result = await authService.confirmEmail(code)
            if (result) {
                res.sendStatus(201)
            } else {
                res.sendStatus(400)
            }
        })
    .post('/registration-email-resending',
        //registrationValidationRules,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            let isReseeded = authService.resendCode(req.body.email)
            if(!isReseeded) return null
            res.sendStatus(200)
        })