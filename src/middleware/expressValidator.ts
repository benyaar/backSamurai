import {NextFunction, Request, Response} from "express";
import {body, validationResult} from 'express-validator'

export const titleValidation = body('title').isLength({min:1, max: 40})
export const authorValidation = body('author').isLength({min:1, max: 20})
export const availableResolutionsValidation = body('availableResolutions').isIn(["P144", 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440','P2160'])


export const expressValidator = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errorsMessages: errors.array({onlyFirstError: true}).map( e => {
               return {message: e.msg, field: e.param}

            }) });
    }
    next()
}