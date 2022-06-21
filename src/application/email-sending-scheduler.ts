import {EmailService} from "../domain/notification-service";
import {notificationRepository} from "../IocContainer";
import {injectable} from "inversify";

@injectable()
export class Scheduler {
    constructor(private emailService: EmailService) {
    }

    async emailSenderRun() {
        const emailToSend = await notificationRepository.dequeueMessage()
        if (emailToSend) {
            setTimeout(async () => {
                let error = await this.emailService.sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
                console.log("error: ", error)
                await notificationRepository.updateMessageStatus(emailToSend._id)
                await this.emailSenderRun()
            }, 1000)
        }
    }
}

