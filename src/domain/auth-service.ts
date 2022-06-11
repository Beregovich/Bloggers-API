import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isAfter} from 'date-fns'
import {emailTemplateService} from "./notification-service";
import {injectable} from "inversify";
import {emailService, usersRepository} from "../IoCContainer";

@injectable()
export class AuthService  {
    async checkCredentials(login: string, password: string) {
        const user = await usersRepository.findUserByLogin(login)
        if (!user || !user.emailConfirmation.isConfirmed) return {
            resultCode: 1,
            data: {
                token: null
            }
        }
        const isHashesEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashesEquals) {
            const token = jwt.sign({userId: user.accountData.id}, 'topSecretKey', {expiresIn: '30d'})
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
    }
    async _generateHash(password: string) {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    }
    async confirmEmail(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        if(!user || user.emailConfirmation.isConfirmed) return false
        let dbCode =  user.emailConfirmation.confirmationCode
        let dateIsExpired = isAfter(user.emailConfirmation.expirationDate, new Date())
        if(dbCode === code && dateIsExpired ){
            let result = await usersRepository.updateConfirmation(user.accountData.id)
            return result
        }
        return false
    }
    async resendCode(email: string) {
        let user = await usersRepository.findUserByEmail(email)
        if(!user || user.emailConfirmation.isConfirmed) return null
            let updatedUser = await usersRepository.updateConfirmationCode(user.accountData.id)
            if(updatedUser){
                let messageBody = emailTemplateService
                    .getEmailConfirmationMessage(updatedUser.emailConfirmation.confirmationCode)
                await emailService.sendEmail(updatedUser.accountData.email, "E-mail confirmation ", messageBody)
                return true
            }
            return null
    }
}
