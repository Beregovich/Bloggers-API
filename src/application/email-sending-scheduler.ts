import {notificationRepository} from "../repositories/notification-db-repository";

export class Scheduler {
    private isWorking: boolean;
    constructor(){
        this.isWorking = false
    }
    async emailSender(sendEmail: (...args: any) => Promise<any>) {
        this.isWorking = true;
        const emailToSend = await notificationRepository.dequeueMessage()
        if(emailToSend){
            setTimeout(async () => {
                const thisIsThis = this
                console.log(this)
                let error = await sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
               // let error = await this.emailService.sendEmail(emailToSend.email, emailToSend.subject, emailToSend.message)
                console.log("error: ",error)
                await notificationRepository.updateMessageStatus(emailToSend._id)
                await this.emailSender(sendEmail)
            }, 1000)
        }else{
            this.isWorking = false
        }
    }
}
//export const scheduler = new Scheduler(emailService)
export const scheduler = new Scheduler()
