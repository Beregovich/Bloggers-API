import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";

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
            return {//Перебираем через map  и Пушим ошибки в масиив с типом который описали
                message: e.msg, //из errors достаем message, msg это обозначение поля от создателей библиотеки
                field: e.param //из errors достаем param, param это обозначение поля от создателей библиотеки
            }
        })

        res.status(400).json(//Возвращаем объект в формате который требует swagger
            {
                "data": {},
                "errorsMessages": errorsOccurred,//Сюда записываем наш собственный массив в который мы заполнили выше
                "resultCode": 1
            }
        )
    }
}