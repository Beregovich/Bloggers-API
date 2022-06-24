import {Request, Response, Router} from 'express'
import {
    bloggerValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import {baseAuthMiddleware, checkHeaders} from "../middlewares/base-auth-middleware";
import {myContainer} from "../IocContainer";
import {getPaginationData} from "../application/common";
import {TYPES} from "../iocTYPES";
import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";

const postsService = myContainer.get<PostsService>(TYPES.PostsService)
const bloggersService = myContainer.get<BloggersService>(TYPES.BloggersService)
export const bloggersRouter = Router()
bloggersRouter
    //Returns all bloggers
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            let bloggers = await bloggersService.getBloggers(page, pageSize, searchNameTerm)
            res.status(200).send(bloggers)
        })
    //Create new blogger
    .post('/',
        checkHeaders,
        bloggerValidationRules,
        inputValidatorMiddleware,
        baseAuthMiddleware,
        async (req: Request, res: Response) => {
            let newBlogger = await bloggersService.createBlogger(
                req.body.name,
                req.body.youtubeUrl
            )
            res.status(201).send(newBlogger)
        })
    //Create new post by blogger ID from uri
    .post('/:bloggerId/posts',
        checkHeaders,
        postValidationRules,
        baseAuthMiddleware,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = req.params.bloggerId
            let newPost = await postsService.createPost({
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                bloggerId,
            })
            if (!newPost) {
                res.sendStatus(404)
                return
            }
            res.status(201).send(newPost)
        })
    //Returns blogger by id
    .get('/:bloggerId',
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                res.status(200).send(blogger)
            } else {
                res.status(404)
                res.send({
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
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const {page, pageSize, searchNameTerm} = getPaginationData(req.query)
            const bloggerId = req.params.bloggerId
            const blogger = await bloggersService.getBloggerById(bloggerId)
            if (blogger) {
                const posts = await postsService.getPosts(page, pageSize, searchNameTerm, bloggerId)
                res.status(200).send(posts)
            } else {
                res.status(404).send({
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
        checkHeaders,
        baseAuthMiddleware,
        bloggerValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId: string = "" + req.params.bloggerId
            const blogger = await bloggersService.updateBloggerById(
                bloggerId,
                req.body.name,
                req.body.youtubeUrl)
            if (!blogger) {
                res.status(404)
                res.send({
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
        checkHeaders,
        baseAuthMiddleware,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const bloggerId = req.params.bloggerId
            const isDeleted = await bloggersService.deleteBloggerById(bloggerId)
            if (isDeleted) {
                res.send(204)
            } else {
                res.status(404)
                res.send({
                    "errorsMessages": [{
                        message: "blogger not found",
                        field: "id"
                    }],
                    "resultCode": 0
                })
            }
        })