import {v4 as uuidv4} from "uuid";
import {EntityWithPaginationType, UserType} from "../types/types";
import {addHours} from "date-fns";
import {EmailService, emailTemplateService} from "./notification-service";
import {inject, injectable} from "inversify";
import {UsersRepository} from "../repositories/mongoose/users-mongoose-repository";
import {TYPES} from "../iocTYPES";
import {AuthService} from "./auth-service";

@injectable()
export class UsersService {
    constructor(@inject<IUsersRepository>(TYPES.IUsersRepository)
                private usersRepository: IUsersRepository,
                @inject<AuthService>(TYPES.AuthService)
                private authService: AuthService,
                @inject<EmailService>(TYPES.EmailService)
                private emailService: EmailService) {
    }

    async getUsers(page: number, pageSize: number, searchNameTerm: string) {
        const users = await this.usersRepository.getUsers(page, pageSize, searchNameTerm)
        return users
    }

    async createUser(login: string, password: string, email: string): Promise<UserType | null> {
        const passwordHash = await this.authService._generateHash(password)
        const newUser: UserType = {
            accountData: {
                id: uuidv4(),
                login: login,
                email: email,
                passwordHash,
                createdAt: new Date()
            },
            // loginAttempts: [],
            emailConfirmation: {
                sentEmails: [],
                confirmationCode: uuidv4(),
                expirationDate: addHours(new Date(), 24),
                isConfirmed: false
            }
        }
        const createdUser = await this.usersRepository.createUser(newUser)
        if (createdUser) {
            let messageBody = emailTemplateService.getEmailConfirmationMessage(createdUser.emailConfirmation.confirmationCode)
            await this.emailService.addMessageInQueue({
                email: newUser.accountData.email,
                message: messageBody,
                subject: "E-mail confirmation ",
                isSent: false,
                createdAt: new Date()
            })
            return createdUser
        } else {
            return null
        }

    }

    async deleteUserById(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUserById(id)
    }
}

export interface IUsersRepository {
    getUsers(page: number, pageSize: number, searchNameTerm: string): Promise<EntityWithPaginationType<UserType[]>>,

    createUser(newUser: UserType): Promise<UserType | null>,

    deleteUserById(id: string): Promise<boolean>,
    findUserById(id: string): Promise<UserType | null>
}



