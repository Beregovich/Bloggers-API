import {Request, Response, Router} from 'express'
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body, check} from "express-validator";
import {bloggersService} from "../domain/bloggers-service";

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
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            res.status(201).send(
                await bloggersService.createBlogger(
                    req.body.name,
                    req.body.youtubeUrl
                )
            )
        })
    //Returns blogger by id
    .get('/:bloggerId',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(id)
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
    //Update existing Blogger by id with InputModel
    .put('/:bloggerId',
        check('bloggerId').isNumeric().withMessage('id should be numeric value'),
        body('name').isString().withMessage('Name should be a string')
            .trim().not().isEmpty().withMessage('Name should be not empty'),
        body('youtubeUrl').matches(urlValidator)
            .withMessage('URL invalid'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const id = +req.params.bloggerId
            const blogger = await bloggersService.updateBloggerById(id,
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
        const id = +req.params.bloggerId
            const isDeleted = await bloggersService.deleteBloggerById(id)
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