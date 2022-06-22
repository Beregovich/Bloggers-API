import nodemailer from "nodemailer";
import {EmailConfirmationMessageType} from "../types/types";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
import {NotificationRepository} from "../repositories/mongoose/notification-mongoose-repository";
import {Scheduler} from "../application/email-sending-scheduler";

export const emailTemplateService = {
    getEmailConfirmationMessage(confirmationCode: string){

        return `<a href="https://bloggers-api-beregovich.herokuapp.com/api/auth/registration-confirmation/?code=${confirmationCode}">${confirmationCode}</a>`
    }
}
@injectable()
export class EmailService  {
    constructor(
        @inject<NotificationRepository>(TYPES.NotificationRepository)
        private notificationRepository: NotificationRepository,
        @inject<Scheduler>(TYPES.Scheduler)
        private scheduler: Scheduler
    ) {
    }
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
    async addMessageInQueue(message: EmailConfirmationMessageType){
        const result = await this.notificationRepository.enqueueMessage(message)
        return result
    }
}
