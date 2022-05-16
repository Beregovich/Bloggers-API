import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isAfter} from 'date-fns'
import {usersRepository} from "../repositories/users-db-repository";
import {emailService, emailTemplateService} from "./notification-service";

export const authService = {
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user || !user.emailConfirmation.isConfirmed) return {
            resultCode: 1,
            data: {
                token: null
            }
        }
        const isHashesEquals = await this._isPasswordCorrect(password, user.passwordHash)
        if (isHashesEquals) {
            const token = jwt.sign({userId: user.id}, 'topSecretKey', {expiresIn: '30d'})
            return {
                resultCode: 0,
                data: {
                    token: token
                }
            }
        } else {
            return {
                resultCode: 1,
                data: {
                    token: null
                }
            }
        }
    },
    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    },
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
    async confirmEmail(code: string, login: string): Promise<boolean> {
        let user = await usersRepository.findUserByLogin(login)
        if(!user)return false
        let dbCode =  user.emailConfirmation.confirmationCode
        let dateIsExpired = isAfter(user.emailConfirmation.expirationDate, new Date())
        if(dbCode === code && dateIsExpired ){
            let result = await usersRepository.updateConfirmation(user._id)
            return result
        }
        return false
    },
    async resendCode(login: string) {
        let user = await usersRepository.findUserByLogin(login)
        if(user){
            let isCodeUpdated = await usersRepository.updateConfirmationCode(user._id)
            if(isCodeUpdated){
                let messageBody = emailTemplateService.getEmailConfirmationMessage(user)
                await emailService.sendEmail(user.accountData.email, "E-mail confirmation ", messageBody)
                return true
            }
        }else return null
    }
}
