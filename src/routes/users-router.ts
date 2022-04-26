import {Request, Response, Router} from 'express'
import {
    bloggerValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import {check} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";
import {getPaginationData} from "../repositories/db";
import {postsService} from "../domain/posts-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {usersService} from "../domain/users-service";
import {ObjectId} from "mongodb";

export const usersRouter = Router()

usersRouter
    //Returns all users
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const users =  await usersService.getUsers(page, pageSize, searchNameTerm)
            res.status(200).send(users)
        })
    //Create new user
    .post('/',
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            res.status(201).send(
                await usersService.createUser(
                    req.body.login,
                    req.body.password
                )
            )
        })
    //Delete user
    .delete('/:userId',
        //check('userId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const userId  = ""+req.params.userId
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