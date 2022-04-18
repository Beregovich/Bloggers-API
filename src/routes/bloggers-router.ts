import {Request, Response, Router} from 'express'
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";
import {bloggersCollection, PostType} from "../repositories/db";
import {postsService} from "../domain/posts-service";
import {requestsSaverMiddleware} from "../middlewares/request-saver-midleware";
import {authMiddleware} from "../middlewares/auth-middleware";

const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/
export const bloggersRouter = Router()

bloggersRouter
    //Returns all bloggers
    .get('/', async (req: Request, res: Response) => {
        res.status(200).send(
            await bloggersService.getBloggers()
        )
    })
    //Create new blogger
    .post('/',
        body('name').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('youtubeUrl').matches(urlValidator).withMessage('URL invalid'),
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
        requestsSaverMiddleware,
        body('title').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('shortDescription').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
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
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
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
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            const posts: PostType[] = await postsService.getPostsByBloggerId(bloggerId)
            if (blogger) {
                res.status(200).send(posts)
            } else {
                res.status(404)
                res.send({
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
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        body('name').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
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
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
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