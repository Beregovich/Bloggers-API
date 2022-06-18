import {Container} from "inversify";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import "reflect-metadata";
import {TYPES} from "./iocTYPES";
import {Scheduler} from "./application/email-sending-scheduler";
import {UsersService} from "./domain/users-service";
import {AuthService} from "./domain/auth-service";
import {CommentsService} from "./domain/comments-service";
import {EmailService} from "./domain/notification-service";
import {PostsService} from "./domain/posts-service";
import {LimitsControlMiddleware} from "./middlewares/limit-control-middleware";
import {BloggersRepository} from "./repositories/mongoose/bloggers-mongoose-repository";
import {
    bloggersModel,
    commentsModel,
    emailsQueueModel,
    limitsModel,
    postsModel,
    usersModel
} from "./repositories/db-with-mongoose";
import {LimitsRepository} from "./repositories/mongoose/limits-mongoose-repository";
import {UsersRepository} from "./repositories/mongoose/users-mongoose-repository";
import {CommentsRepository} from "./repositories/mongoose/comments-mongoose-repository";
import {PostsRepository} from "./repositories/mongoose/posts-mongoose-repository";
import {NotificationRepository} from "./repositories/mongoose/notification-mongoose-repository";

export const myContainer = new Container();
//Repositories
export const bloggersRepository = new BloggersRepository(bloggersModel, postsModel)
export const limitsRepository = new LimitsRepository(limitsModel)
export const usersRepository = new UsersRepository(usersModel)
export const commentsRepository = new CommentsRepository(commentsModel)
export const postsRepository = new PostsRepository(postsModel, bloggersModel, bloggersRepository)
export const notificationRepository = new NotificationRepository(emailsQueueModel)
//Services
export const bloggersService = new BloggersService(bloggersRepository)
export const emailService = new EmailService()
export const usersService = new UsersService(usersRepository)
export const authService = new AuthService(emailService)
export const commentsService = new CommentsService(commentsRepository)
export const postsService = new PostsService(postsRepository)
//Other
export const scheduler = new Scheduler(emailService)
export const limitsControl = new LimitsControlMiddleware(limitsRepository)



myContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository);
myContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
myContainer.bind<BloggersRepository>(TYPES.BloggersRepository).toConstantValue(bloggersRepository)
myContainer.bind<LimitsRepository>(TYPES.LimitsRepository).toConstantValue(limitsRepository)
