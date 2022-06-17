import {Request, Response, Router} from 'express'
import {
    inputValidatorMiddleware,
    paginationRules,
    userValidationRules
} from "../middlewares/input-validator-middleware";
import {baseAuthMiddleware, checkHeaders} from "../middlewares/base-auth-middleware";
import {usersService} from "../IoCContainer";
import {getPaginationData} from "../application/common";

export const usersRouter = Router()
usersRouter
    //Returns all users
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const users = await usersService.getUsers(page, pageSize, searchNameTerm)
            res.status(200).send(users)
        })
    //Create new user
    .post('/',
        checkHeaders,
        baseAuthMiddleware,
        userValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const createdUser = await usersService.createUser(
                req.body.login,
                req.body.password,
                req.body.email
            )
            res.status(201).send(createdUser)
        })
    //Delete user
    .delete('/:userId',
        checkHeaders,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            const userId = req.params.userId
            const isDeleted = await usersService.deleteUserById(userId)
            if (isDeleted) {
                res.send(204)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            }
        })