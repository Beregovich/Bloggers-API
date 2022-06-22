import {NextFunction, Request, Response} from "express";
import {myContainer} from "../IocContainer";
import {CommentsService} from "../domain/comments-service";
import {TYPES} from "../iocTYPES";

const commentsService  = myContainer.get<CommentsService>(TYPES.CommentsService)

export const checkOwnership = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.commentId
    const commentToChangeOrRemove = await commentsService.getCommentById(commentId)
    if(!commentToChangeOrRemove ){
        res.sendStatus(404)
    }else if(commentToChangeOrRemove.userLogin != req.user!.accountData.login){
        res.sendStatus(403)
        console.log(("Forbidden"))
    }else{
        next()
    }
}
