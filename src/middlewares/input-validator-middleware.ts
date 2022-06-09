import {Request, Response, NextFunction} from "express";
import {body, check, validationResult} from "express-validator";
import {ErrorMessageType} from "../types/types";

//Rules
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/
const emailValidator = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const emailValidationRule = check('email').matches(emailValidator).withMessage("wrong email")
const loginValidationRule = check('login').isString()
    .isLength({min: 3, max:10})
    .withMessage("login should be 3<len<10 string")
const passwordValidationRule = check('password').isString()
    .isLength({min: 6, max:20})
    .withMessage("password should be 6<len<20 string")

export const postValidationRules = [
    body('title').isString().isLength({max: 30}).trim().not().isEmpty().withMessage('Name should be a string less 30ch'),
    body('shortDescription').isString()
        .isLength({max: 100}).trim().not().isEmpty().withMessage('shortDescription should be a string less 100ch'),
    body('content').isString()
        .isLength({max: 1000}).trim().not().isEmpty().withMessage('shortDescription should be a string less 1000ch')
]
export const bloggerValidationRules = [
    body('name').isString().isLength({max: 15}).trim().not().isEmpty().withMessage('Name should be a string'),
    body('youtubeUrl').matches(urlValidator).isLength({max: 100}).withMessage('URL invalid'),
]
export const userValidationRules = [
    body("login").isString().isLength({min: 3, max: 10})
        .withMessage('Login length should be:  3<len<10'),
    body("password").isString().isLength({min: 6, max: 20})
        .withMessage('Password length should be:  6<len<20')
]
export const commentValidationRules = [
    body("content").isString().isLength({min: 20, max: 300})
        .withMessage('Password length should be:  20<len<300')
]
export const paginationRules = [
    check('page').optional({checkFalsy: true,  }, )
        .isInt({min: 1}).withMessage('page should be numeric value'),
    check('pageSize').optional({checkFalsy: true})
        .isInt({min: 1}).withMessage('pageSize should be numeric value'),
    check('searchNameTerm').optional({checkFalsy: true})
        .isString().withMessage('searchNameTerm should be string'),
]
export const registrationValidationRules = [
    emailValidationRule,
    loginValidationRule,
    passwordValidationRule
]
export const inputValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    } else {
        const errorsOccurred: ErrorMessageType[] = errors.array({ onlyFirstError: true }).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        })
        res.status(400).json(errorsOccurred)
    }
}