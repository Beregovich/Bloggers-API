import {Request, Response, Router} from 'express'
import {bloggers} from '../repositories/db'
import {
    createBlogger,
    deleteBloggerById,
    getBloggerById,
    getBloggers,
    updateBloggerById
} from "../repositories/bloggers-repository";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body} from "express-validator";

const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/


export const bloggersRouter = Router()

bloggersRouter
    //Returns all bloggers
    .get('/', (req: Request, res: Response) => {
        res.status(200).send(getBloggers())
    })
    //Create new blogger
    .post('/',
        body('name').isString().withMessage('Name should be a string')
            .not().isEmpty().withMessage('Name should be not empty')
            .matches(/[^\s]/).withMessage('not only whitespaces'),
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const newBlogger = {
                id: +(new Date()),
                name: req.body.name,
                youtubeUrl: req.body.youtubeUrl
            }
            bloggers.push(newBlogger)
            res.status(201).send(createBlogger({
                name: req.body.name,
                youtubeUrl: req.body.youtubeUrl
            }))
        })
    //Returns blogger by id
    .get('/:bloggerId', (req: Request, res: Response) => {
        const id = +req.params.bloggerId
        if (id) {
            res.status(200).send(getBloggerById(id))
        } else {
            res.status(404)
            res.send({
                "data": {},
                "errorsMessages": [{
                    message: "blogger not found or blogger's id invalid",
                    field: "id"
                }],
                "resultCode": 1
            })
        }
    })
    //Update existing Blogger by id with InputModel
    .put('/:bloggerId',
        body('name').isString().withMessage('Name should be a string')
            .not().isEmpty().withMessage('Name should be not empty')
            .matches(/[^\s]/).withMessage('not only whitespaces'),
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
        inputValidatorMiddleware,
        (req: Request, res: Response) => {
            const id = +req.params.bloggerId
            const blogger = bloggers.find(b => b.id === id)
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
                updateBloggerById(id,
                    req.body.name,
                    req.body)
                res.send(204)
            }
        })
    //Delete blogger specified by id
    .delete('/:postId', (req: Request, res: Response) => {
        const id = +req.params.postId
        if (id) {
            deleteBloggerById(id)
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