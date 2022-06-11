import {Container} from "inversify";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {BloggersRepository} from "./repositories/bloggers-db-repository";
import {
    bloggersCollection,
    commentsCollection,
    emailToSendQueueCollection,
    limitsCollection,
    postsCollection,
    usersCollection
} from "./repositories/db";
import "reflect-metadata";
import {TYPES} from "./iocTYPES";
import {LimitsRepository} from "./repositories/limits-db-repository";
import {Scheduler} from "./application/email-sending-scheduler";
import {UsersService} from "./domain/users-service";
import {AuthService} from "./domain/auth-service";
import {CommentsService} from "./domain/comments-service";
import {EmailService} from "./domain/notification-service";
import {PostsService} from "./domain/posts-service";
import {LimitsControlMiddleware} from "./middlewares/limit-control-middleware";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {NotificationRepository} from "./repositories/notification-db-repository";
import {PostsRepository} from "./repositories/posts-db-repository";
import {UsersRepository} from "./repositories/users-db-repository";

export const myContainer = new Container();

export const bloggersRepository = new BloggersRepository(bloggersCollection, postsCollection)
export const bloggersService = new BloggersService(bloggersRepository)
export const limitsRepository = new LimitsRepository(limitsCollection)
export const emailService = new EmailService()
export const scheduler = new Scheduler(emailService)
export const usersRepository = new UsersRepository(usersCollection)
export const usersService = new UsersService(usersRepository)
export const authService = new AuthService()
export const commentsRepository = new CommentsRepository(commentsCollection)
export const commentsService = new CommentsService(commentsRepository)
export const postsRepository = new PostsRepository(postsCollection, bloggersCollection, bloggersRepository)
export const postsService = new PostsService(postsRepository)
export const limitsControl = new LimitsControlMiddleware(limitsRepository)
export const notificationRepository = new NotificationRepository(emailToSendQueueCollection)


myContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository);
myContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
myContainer.bind<BloggersRepository>(TYPES.BloggersRepository).toConstantValue(bloggersRepository)
myContainer.bind<LimitsRepository>(TYPES.LimitsRepository).toConstantValue(limitsRepository)
