import {EmailService} from "../domain/notification-service";
import {inject, injectable} from "inversify";
import {TYPES} from "../iocTYPES";
import {NotificationRepository} from "../repositories/notification-mongoose-repository";


@injectable()
export class Scheduler {
    constructor(
        @inject<EmailService>(TYPES.EmailService)
        private emailService: EmailService,
        @inject<NotificationRepository>(TYPES.NotificationRepository)
        private notificationRepository: NotificationRepository
    ) {
    }

    async emailSenderRun() {
        const emailToSend = await this.notificationRepository.dequeueMessage()
        if (emailToSend) {
            setTimeout(async () => {
                await this.emailService.sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
                await this.notificationRepository.updateMessageStatus(emailToSend._id)
                await this.emailSenderRun()
            }, 1000)
        }
    }
}

