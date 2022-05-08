import {Request, Response, Router} from 'express'
import {
    bloggerValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules, userValidationRules
} from "../middlewares/input-validator-middleware";
import {check} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";
import {getPaginationData} from "../repositories/db";
import {postsService} from "../domain/posts-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersService} from "../domain/users-service";
import {ObjectId} from "mongodb";
import {baseAuthMiddleware} from "../middlewares/base-auth-middleware";

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
        baseAuthMiddleware,
        userValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const createdUser = await usersService.createUser(
                req.body.login,
                req.body.password
            )
            res.status(201).send(createdUser)
        })
    //Delete user
    .delete('/:userId',
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