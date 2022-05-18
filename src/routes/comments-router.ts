import {Request, Response, Router} from 'express'
import {commentValidationRules, inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {check} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsService} from "../domain/comments-service";
import {checkOwnership} from "../middlewares/check-ownership-middleware";

export const commentsRouter = Router()
commentsRouter
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
        checkOwnership,
        commentValidationRules,
        inputValidatorMiddleware,
        check('commentId').isString().withMessage('id should be string'),
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