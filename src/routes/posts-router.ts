import express, {Request, Response, Router} from 'express'
import {posts, bloggers} from '../repositories/db'
import {createPost, deletePostById, getPostById, getPosts, updatePostById} from "../repositories/posts-repository";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";

type ErrorMessageType = {
    message: string;
    field: string;
}

export const postsRouter = Router()

//---------------------------------Posts---------------------------------

postsRouter
    //Returns all posts
    .get('/', (req: Request, res: Response) => {
        res.status(200).send(getPosts())
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
        (req: Request, res: Response) => {
            const blogger = bloggers.find(b => b.id === req.body.blogId)
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
                const newPost = createPost({
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    blogId: req.body.blogId,
                })
                res.status(200).send(newPost)
            }
        })
    //Return post by id
    .get('/:postId', (req: Request, res: Response) => {
        const id = +req.params.postId
        if (id) {
            res.send(getPostById(id))
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
    .put('/:postsId',
        body('title').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('shortDescription').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),
        body('content').isString().withMessage('shortDescription should be a string')
            .trim().not().isEmpty().withMessage('shortDescription should be not empty'),

        inputValidatorMiddleware,
        authMiddleware,
        (req: Request, res: Response) => {
            const id = +req.params.postsId
            const post = posts.find(p => p.id === id)
            let isValid = true;
            let trobblesOccured: ErrorMessageType[] = [];
            if (!post) {
                isValid = false;
                res.status(404)
                res.send({
                    "data": {},
                    "errorsMessages": [{
                        message: "post not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
                return
            }
            if (!req.body.title) {
                isValid = false
                trobblesOccured.push({
                    message: "title required",
                    field: "title"
                })
            }
            if (!req.body.shortDescription) {
                isValid = false
                trobblesOccured.push({
                    message: "shortDescription required",
                    field: "shortDescription"
                })
            }
            if (!req.body.content) {
                isValid = false
                trobblesOccured.push({
                    message: "content required",
                    field: "content"
                })
            }

            if (isValid) {
                const updatePost = {
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    blogId: id
                }
                res.status(200).send(
                    updatePostById(updatePost))
            } else {
                res.status(400)
                res.send({
                    "data": {},
                    "errorsMessages": trobblesOccured,
                    "resultCode": 1
                })
            }
        })
    //Delete post specified by id
    .delete('/:postId', (req: Request, res: Response) => {
        const id = +req.params.postId
        if (id) {
            deletePostById(id)
            res.send(204)
        } else {
            res.status(404)
            res.send({
                "data": {},
                "errorsMessages": [{
                    message: "post not found or post's id invalid",
                    field: "id"
                }],
                "resultCode": 1
            })
        }
    })