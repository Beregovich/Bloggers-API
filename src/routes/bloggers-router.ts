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
    //Returns all bloggers
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const queryString = req.query
            const page = typeof queryString.page === 'string' ? +queryString.page : 1
            const pageSize = typeof queryString.pageSize === 'string' ? +queryString.pageSize : 5
            const searchNameTerm = queryString.SearchNameTerm === 'string' ? queryString.SearchNameTerm : ""
            res.status(200).send(
                await bloggersService.getBloggers(page, pageSize, searchNameTerm)
            )
        })
    //Create new blogger
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
    //Create new post by blogger ID from uri
    .post('/:bloggerId/posts',
        postValidationRules,
        inputValidatorMiddleware,
        authMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            res.status(201).send(
                await postsService.createPost({
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    bloggerId,
                })
            )
        })
    //Returns blogger by id
    .get('/:bloggerId',
        check('bloggerId').isInt({min: 1}).withMessage('id should be integer positive value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                res.status(200).send(blogger)
            } else {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })
    //return exact blogger's all posts
    .get('/:bloggerId/posts',
        check('bloggerId').isInt({min: 1}).withMessage('id should be positive integer value'),
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                const posts = await postsService.getPosts(page, pageSize, searchNameTerm, bloggerId)
                res.status(200).send(posts)
            } else {
                res.status(404).send({
                    "data": {},
                    "errorsMessages": [{
                        message: "posts not found",
                        field: "bloggerId"
                    }],
                    "resultCode": 1
                })
            }
        })
    //Update existing Blogger by id with InputModel
    .put('/:bloggerId',
        check('bloggerId').isInt({min: 1}).withMessage('id should be positive integer value'),
        bloggerValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.updateBloggerById(
                bloggerId,
                req.body.name,
                req.body.youtubeUrl)
            if (!blogger) {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            } else {
                res.send(204)
            }
        })
    //Delete blogger specified by id
    .delete('/:bloggerId',
        check('bloggerId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const isDeleted = await bloggersService.deleteBloggerById(bloggerId)
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