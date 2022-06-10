import nodemailer from "nodemailer";
import {emailConfirmationType} from "../types/types";
import {notificationRepository} from "../repositories/notification-db-repository";
import {scheduler} from "../application/email-sending-scheduler";

export const emailTemplateService = {
    getEmailConfirmationMessage(confirmationCode: string){

        return `<a href="https://bloggers-api-beregovich.herokuapp.com/api/auth/registration-confirmation/?code=${confirmationCode}">${confirmationCode}</a>`
    }
}
export class EmailService  {
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',                              // the service used
            auth: {
                user: process.env.EMAIL_FROM,              // authentication details of sender, here the details are coming from .env file
                pass: process.env.EMAIL_FROM_PASSWORD,
            },
        });
        try{
            await transporter.sendMail({
                from: "From me to You",
                to: email,
                subject: subject,
                html: message
            },(err)=>err)
        }catch(e){
            console.log("sendMail function error: "+e)
        }
    }
    async addMessageInQueue(message: emailConfirmationType){
        const result = await notificationRepository.enqueueMessage(message)
        if(result) await scheduler.emailSender(this.sendEmail)
        return result
    }
}
export const emailService = new EmailService()
