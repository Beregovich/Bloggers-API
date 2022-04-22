import {Request, Response, Router} from 'express'
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {bloggersService} from "../domain/bloggers-service";
import {getPaginationData, PostType, PostWithPaginationType} from "../repositories/db";

export const postsRouter = Router()

postsRouter
    //Returns all posts
    .get('/',
        check('page').optional({checkFalsy: true})
            .isNumeric().withMessage('page should be numeric value'),
        check('pageSize').optional({checkFalsy: true})
            .isNumeric().withMessage('pageSize should be numeric value'),
        check('searchNameTerm').optional({checkFalsy: true})
            .isString().withMessage('searchNameTerm should be string'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const posts: PostWithPaginationType = await postsService
                .getPosts(page, pageSize, searchNameTerm, null)
            res.status(200).send(posts)
        })
    //Create new post
    .post('/',
        body('title').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('shortDescription').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        inputValidatorMiddleware,
        authMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId: number = parseInt(req.body.bloggerId)
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (!blogger) {
                res.status(400).send({
                    "data": {},
                    "errorsMessages": [
                        {
                            message: "blogger not found",
                            field: "blogger"
                        }
                    ],
                    "resultCode": 1
                })
            } else {
                const newPost = await postsService.createPost({
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    bloggerId,
                })
                res.status(201).send(newPost)
            }
        })
    //Return post by id
    .get('/:postId',
        check('postId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const postId = +req.params.postId
            const returnedPost = await postsService.getPostById(postId)
            if (returnedPost) {
                res.send(returnedPost)
            } else {
                res.status(404).send({
                    "data": {},
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })
    //Update existing post by id with InputModel
    .put('/:postId',
        body('title').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('shortDescription').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string'),
        check('postId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        authMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.params.postId
            const updatePost = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                bloggerId: req.body.bloggerId
            }
            const bloggerToUpdate = await bloggersService.getBloggerById(updatePost.bloggerId)
            if (!bloggerToUpdate) {
                res.status(400).send({
                    "data": {},
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "bloggerId"
                    }],
                    "resultCode": 0
                })
                return
            }
            const updatedPost = await postsService.updatePostById(id, updatePost)
            if (!updatedPost) {
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            } else {
                res.status(204).send(updatedPost)
            }
        })
    //Delete post specified by id
    .delete('/:postId',
        async (req: Request, res: Response) => {
            const id = +req.params.postId
            const isDeleted = await postsService.deletePostById(id)
            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.status(404).send({
                    "data": {},
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 1
                })
            }
        })