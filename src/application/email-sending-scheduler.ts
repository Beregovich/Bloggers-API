import {notificationRepository} from "../repositories/notification-db-repository";
import {EmailService} from "../domain/notification-service";

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
                console.log("error: ",error)
                await notificationRepository.updateMessageStatus(emailToSend._id)
                await this.emailSender()
            }, 1000)
        }else{
            this.isWorking = false
        }
    }
}

