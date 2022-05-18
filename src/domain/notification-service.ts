import nodemailer from "nodemailer";

export const emailTemplateService = {
    getEmailConfirmationMessage(user: any){ //any!
        return `<H1>Hello</H1>
\n<h3>Your confirmation code:${user.emailConfirmation.confirmationCode}<h3>`
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
            })
        }catch(e){
            console.log("sendMail function error: "+e)
        }
    }
}
export const emailService = new EmailService()
