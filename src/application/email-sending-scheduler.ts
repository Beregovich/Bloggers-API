import {EmailService, emailService} from "../domain/notification-service";
import {notificationRepository} from "../repositories/notification-db-repository";


// const emailToSend = {
//     email: "123@mail.ru",
//     message: "message",
//     subject: "string",
//     isSent: false
// }

export class Scheduler {
    private isWorking: boolean;
    constructor(private emailService: EmailService){
        this.isWorking = false
    }
    async emailSender() {
        this.isWorking = true;
        const emailToSend = await notificationRepository.dequeueMessage()
        if(emailToSend){
            setTimeout(async () => {
                let error = await this.emailService.sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
                debugger
                console.log(error)
                await notificationRepository.updateMessageStatus(emailToSend._id)
                this.emailSender()
            }, 1000)
        }else{
            this.isWorking = false
        }
    }
}
export const scheduler = new Scheduler(emailService)
