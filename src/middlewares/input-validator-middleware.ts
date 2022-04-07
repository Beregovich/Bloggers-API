import {Request, Response, NextFunction} from "express";
import { validationResult} from "express-validator";

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }else{
        res.status(400).json({resultCode: 1, errors: errors.array()})
    }
}