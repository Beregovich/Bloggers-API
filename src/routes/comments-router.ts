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

export const bloggersRouter = Router()

bloggersRouter
    //Returns all comments
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })
    //Create new comment
    .post('/',
        bloggerValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            res.status(201).send(
                await bloggersService.createBlogger(
                    req.body.name,
                    req.body.youtubeUrl
                )
            )
        })

    //Update comment
    .put('/:commentId',
        check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })
    //Delete comment specified by id
    .delete('/:commentId',
        check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })