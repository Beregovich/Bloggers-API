import {Request, Response, Router} from 'express'
import {
    bloggerValidationRules,
    inputValidatorMiddleware,
    paginationRules,
    postValidationRules
} from "../middlewares/input-validator-middleware";
import {check} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsService} from "../domain/comments-service";

export const commentsRouter = Router()

commentsRouter
    //Returns all comments
    .get('/',
        paginationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const comments = await commentsService.getComments(1,10,"")
            res.send(comments)
        })
    //Create new comment
    .post('/',
        authMiddleware,
        bloggerValidationRules,
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })

    //Update comment
    .put('/:commentId',
        authMiddleware,
        check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })
    //Delete comment specified by id
    .delete('/:commentId',
        authMiddleware,
        check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {

        })