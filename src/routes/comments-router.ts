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
import {getPaginationData, QueryDataType} from "../repositories/db";
import {checkOwnership} from "../middlewares/check-ownership-middleware";

export const commentsRouter = Router()

commentsRouter
    //Returns all comments
    /*.get('/',
        paginationRules,
        async (req: Request, res: Response) => {
            const paginationData: QueryDataType = getPaginationData(req.query)
            const comments = await commentsService.getComments(paginationData, null)
            res.send(comments)
        })*/

    .get('/:commentId',
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId
            const comment = await commentsService.getCommentById(commentId)
            if(comment){
                res.send(comment)
            }else{
                res.sendStatus(404)
            }

        })

    //Update comment
    .put('/:commentId',
        authMiddleware,
        check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId
            const content = req.body.content
            const updated = await commentsService.updateCommentById(commentId, content)
            if(updated){
                res.sendStatus(204)
            }else{
                res.sendStatus(404)
            }
        })
    //Delete comment specified by id
    .delete('/:commentId',
        authMiddleware,
        checkOwnership,
        //check('commentId').isInt({min: 1}).withMessage('id should be positive integer value'),
        inputValidatorMiddleware,
        async (req: Request, res: Response) => {
            const commentId = req.params.commentId
            //403 error
            const result = await commentsService.deleteComment(commentId)
            if(result){
                res.sendStatus(204)
            }else{
                res.sendStatus(404)
            }
        })