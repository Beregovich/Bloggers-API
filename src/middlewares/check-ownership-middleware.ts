import {NextFunction, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";

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
