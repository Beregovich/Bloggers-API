import {EmailService} from "../domain/notification-service";
import {notificationRepository} from "../IoCContainer";
import {injectable} from "inversify";

@injectable()
export class Scheduler {
    private _isWorking: boolean;
    constructor(private emailService: EmailService) {
        this._isWorking = false
    }

    public get isWorking() {
        return this._isWorking
    }

    async emailSender() {
        this._isWorking = true;
        const emailToSend = await notificationRepository.dequeueMessage()
        if (emailToSend) {
            setTimeout(async () => {
                let error = await this.emailService.sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
                console.log("error: ", error)
                await notificationRepository.updateMessageStatus(emailToSend._id)
                await this.emailSender()
            }, 1000)
        } else {
            this._isWorking = false
        }
    }
}

