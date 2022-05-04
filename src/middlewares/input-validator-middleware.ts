import {Request, Response, NextFunction} from "express";
import {body, check, validationResult} from "express-validator";

//Rules
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/
export const postValidationRules = [
    body('title').isString().isLength({max: 30}).trim().not().isEmpty().withMessage('Name should be a string less 30ch'),
        //.trim().not().isEmpty().withMessage('Name should be not empty'),
    body('shortDescription').isString()
        .isLength({max: 100}).trim().not().isEmpty().withMessage('shortDescription should be a string less 100ch'),
        //.trim().not().isEmpty().withMessage('shortDescription should be not empty'),
    body('content').isString()
        .isLength({max: 1000}).trim().not().isEmpty().withMessage('shortDescription should be a string less 1000ch')
        //.trim().not().isEmpty().withMessage('shortDescription should be not empty'),
]

export const bloggerValidationRules = [
    body('name').isString().isLength({max: 15}).trim().not().isEmpty().withMessage('Name should be a string'),
        //.trim().not().isEmpty().withMessage('Name should be not empty'),
    body('youtubeUrl').matches(urlValidator).isLength({max: 100}).withMessage('URL invalid'),
]

export const paginationRules = [
    check('page').optional({checkFalsy: true})
        .isInt({min: 1}).withMessage('page should be numeric value'),
    check('pageSize').optional({checkFalsy: true})
        .isInt({min: 1}).withMessage('pageSize should be numeric value'),
    check('searchNameTerm').optional({checkFalsy: true})
        .isString().withMessage('searchNameTerm should be string'),
]

type ErrorMessageType = { //Тип, для массива с ошибками
    message: string; //Описание ошибки которое пишешь ты
    field: string; //Месо где произошла ошибка: title, id итд
}

export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)//Сюда записываются все ошибки которые произошли
    if (errors.isEmpty()) {//если ошибок нет то
        next() //двигаемся дальше
    } else {
        const errorsOccurred: ErrorMessageType[] = errors.array().map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })

        res.status(400).json(
            {
                "errorsMessages": errorsOccurred,
                "resultCode": 1
            }
        )
    }
}