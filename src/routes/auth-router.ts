import {Request, Response, Router} from 'express'
import {
    emailValidationRule,
    inputValidatorMiddleware,
    registrationValidationRules,
    userValidationRules
} from "../middlewares/input-validator-middleware";
import {body} from "express-validator";
import {myContainer} from "../IocContainer";
import {UsersService} from "../domain/users-service";
import {AuthService} from "../domain/auth-service";
import {LimitsControlMiddleware} from "../middlewares/limit-control-middleware";
import {TYPES} from "../iocTYPES";

const usersService = myContainer.get<UsersService>(TYPES.UsersService)
const authService = myContainer.get<AuthService>(TYPES.AuthService)
const limitsControl = myContainer.get<LimitsControlMiddleware>(TYPES.LimitsControlMiddleware)

export const authRouter = Router({})
authRouter
    .post('/login',
        userValidationRules,
        inputValidatorMiddleware,
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
        registrationValidationRules,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        limitsControl.checkUserExisting.bind(limitsControl),
        async (req: Request, res: Response) => {
            const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
            user
                ? res.sendStatus(204)
                : res.sendStatus(400)
        })
    .post('/registration-confirmation',
        body('code').isString().withMessage('code should be a string'),
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const code = req.body.code
            const result = await authService.confirmEmail(code)
            if (result) {
                res.sendStatus(204)
            } else {
                res.status(400).send({
                    errorsMessages: [{message: "wrong code", field: "code"}]
                })
            }
        })
    .post('/registration-email-resending',
        emailValidationRule,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            let isResended = await authService.resendCode(req.body.email)
            if (!isResended) return res.status(400)
                .send({
                    errorsMessages: [{
                        message: "email already confirmed or such email not found",
                        field: "email"
                    }]
                })
            res.sendStatus(204)
        })
    .post('/me',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
        })
    .post('/logout',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
        })
    .post('/refresh-token',
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {

        })