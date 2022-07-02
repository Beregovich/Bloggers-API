import {Request, Response, Router} from 'express'
import {
    emailValidationRule,
    inputValidatorMiddleware,
    registrationValidationRules,
    userValidationRules
} from "../middlewares/input-validator-middleware";
import {body} from "express-validator";
import {iocContainer} from "../IocContainer";
import {UsersService} from "../domain/users-service";
import {AuthService} from "../domain/auth-service";
import {LimitsControlMiddleware} from "../middlewares/limit-control-middleware";
import {TYPES} from "../iocTYPES";
import {authMiddleware} from "../middlewares/auth-middleware";
import {CheckRefreshTokenMiddleware} from "../middlewares/check-refresh-token-middleware";

const usersService = iocContainer.get<UsersService>(TYPES.UsersService)
const authService = iocContainer.get<AuthService>(TYPES.AuthService)
const limitsControl = iocContainer.get<LimitsControlMiddleware>(TYPES.LimitsControlMiddleware)
const checkRefreshTokenMiddleware = iocContainer.get<CheckRefreshTokenMiddleware>(TYPES.CheckRefreshTokenMiddleware)

export const authRouter = Router({})
authRouter
    .post('/login',
        userValidationRules,
        inputValidatorMiddleware,
        limitsControl.checkLimits.bind(limitsControl),
        async (req: Request, res: Response) => {
            const checkResult = await authService.checkCredentials(req.body.login, req.body.password)
            if (checkResult.resultCode === 0 ) {
                res.cookie("refreshToken", checkResult.data.refreshToken, {httpOnly: true, secure: true})
                return res.status(200).send({accessToken: checkResult.data.accessToken})
            } else {
                return res.sendStatus(401)
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
            const isResented = await authService.resendCode(req.body.email)
            if (!isResented) return res.status(400)
                .send({
                    errorsMessages: [{
                        message: "email already confirmed or such email not found",
                        field: "email"
                    }]
                })
            res.sendStatus(204)
        })
    .get('/me',
        //limitsControl.checkLimits.bind(limitsControl),
        authMiddleware,
        async (req: Request, res: Response) => {
        const userAccountData = res.locals.userData.accountData
            res.status(200).send({
                "email": userAccountData.email,
                "login": userAccountData.login,
                "userId": userAccountData.id
            })
        })
    .post('/logout',
        //limitsControl.checkLimits.bind(limitsControl),
        checkRefreshTokenMiddleware.checkToken.bind(checkRefreshTokenMiddleware),
        async (req: Request, res: Response) => {
       const userId = res.locals.userData.accountData.userId
            const result = await usersService.addRevokedToken(userId, req.cookies.refreshToken)//return updated user
            res.sendStatus(204)
        })
    .post('/refresh-token',
        //limitsControl.checkLimits.bind(limitsControl),
        checkRefreshTokenMiddleware.checkToken.bind(checkRefreshTokenMiddleware),
        async (req: Request, res: Response) => {
        debugger
            try {
                const refreshToken = req.cookies.refreshToken
                if (!refreshToken) return res.sendStatus(401)
                const user = res.locals.userData.accountData
                const newTokens = authService.createJwtTokensPair(user.id)
                if (!newTokens) {
                    return res.sendStatus(401)
                }
                res.cookie('refreshToken', newTokens.refreshToken, {httpOnly: true, secure: true})
                return res.send({accessToken: newTokens.accessToken})
            } catch (e) {
                console.error(e)
            }
        })