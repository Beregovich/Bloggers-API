import {Request, Response, Router} from 'express'
import {bloggers} from '../repositories/db'
import {
    createBlogger,
    deleteBloggerById,
    getBloggerById,
    getBloggers,
    updateBloggerById
} from "../repositories/bloggers-repository";

const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/
type ErrorMessageType = {
    message: string;
    field: string;
}

export const bloggersRouter = Router()

bloggersRouter
    //Returns all bloggers
    .get('/', (req: Request, res: Response) => {
        res.status(200).send(getBloggers())
    })
    //Create new blogger
    .post('/', (req: Request, res: Response) => {
        let isValid = true;
        let trobblesOccured: ErrorMessageType[] = [];
        if (!req.body.name && req.body.name.trim()) {
            isValid = false
            trobblesOccured.push({
                message: "name required",
                field: "name"
            })
        }
        if (!urlValidator.test(req.body.youtubeUrl)) {
            isValid = false
            trobblesOccured.push({
                message: "The field YoutubeUrl must match the regular expression" +
                    " '^https://([a-zA-Z0-9_-]+\\\\.)+[a-zA-Z0-9_-]+(\\\\/[a-zA-Z0-9_-]+)*\\\\/?$'.\"",
                field: "youtubeUrl"
            })
        }
        if (isValid) {
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
        } else {
            res.status(400)
            res.send({
                "data": {},
                "errorsMessages": trobblesOccured,
                "resultCode": 1
            })
        }
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
    .put('/:bloggerId', (req: Request, res: Response) => {
        let isValid = true;
        let trobblesOccured: ErrorMessageType[] = [];
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
            return
        }
        if (!urlValidator.test(req.body.youtubeUrl)) {
            isValid = false;
            trobblesOccured.push({
                message: "blogger's youtube URL invalid",
                field: "youtubeUrl"
            })
        }
        if (!id) {
            isValid = false;
            trobblesOccured.push({
                message: "blogger's id is invalid",
                field: "id"
            })
        }
        if (!req.body.name) {
            isValid = false;
            trobblesOccured.push({
                message: "blogger's name is invalid",
                field: "name"
            })
        }
        if (isValid) {
            updateBloggerById(id,
                req.body.name,
                req.body)
            res.send(204)
        } else {
            res.status(400)
            res.send({
                "data": {},
                "errorsMessages": trobblesOccured,
                "resultCode": 1
            })
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