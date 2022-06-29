import "reflect-metadata";
import {Container} from "inversify";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {TYPES} from "./iocTYPES";
import {Scheduler} from "./application/email-sending-scheduler";
import {IUsersRepository, UsersService} from "./domain/users-service";
import {AuthService} from "./domain/auth-service";
import {CommentsService, ICommentRepository} from "./domain/comments-service";
import {EmailService} from "./domain/notification-service";
import {IPostsRepository, PostsService} from "./domain/posts-service";
import {LimitsControlMiddleware} from "./middlewares/limit-control-middleware";
import {BloggersRepository} from "./repositories/mongoose/bloggers-mongoose-repository";
import {
    bloggersSchema,
    commentsSchema,
    emailsQueueSchema,
    limitsSchema,
    postsSchema,
    usersSchema
} from "./repositories/db-with-mongoose";
import {LimitsRepository} from "./repositories/mongoose/limits-mongoose-repository";
import {UsersRepository} from "./repositories/mongoose/users-mongoose-repository";
import {CommentsRepository} from "./repositories/mongoose/comments-mongoose-repository";
import {PostsRepository} from "./repositories/mongoose/posts-mongoose-repository";
import {NotificationRepository} from "./repositories/mongoose/notification-mongoose-repository";
import mongoose from "mongoose";
import {
    BloggerType,
    CommentType,
    EmailConfirmationMessageType,
    LimitsControlType,
    PostType,
    UserType
} from "./types/types";

export const iocContainer = new Container();
//Models
const bloggersModel = mongoose.model('Bloggers', bloggersSchema)
const postsModel = mongoose.model('Posts', postsSchema)
const usersModel = mongoose.model('Users', usersSchema)
const commentsModel = mongoose.model('Comments', commentsSchema)
const limitsModel = mongoose.model('Limits', limitsSchema)
const emailsQueueModel = mongoose.model('EmailsQueue', emailsQueueSchema)

//bloggers
iocContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository);
iocContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
//posts
iocContainer.bind<IPostsRepository>(TYPES.IPostsRepository).to(PostsRepository);
iocContainer.bind<PostsService>(TYPES.PostsService).to(PostsService);
//users
iocContainer.bind<IUsersRepository>(TYPES.IUsersRepository).to(UsersRepository);
iocContainer.bind<UsersService>(TYPES.UsersService).to(UsersService);
//comments
iocContainer.bind<ICommentRepository>(TYPES.CommentsRepository).to(CommentsRepository);
iocContainer.bind<CommentsService>(TYPES.CommentsService).to(CommentsService);
//limits
iocContainer.bind<LimitsRepository>(TYPES.LimitsRepository).to(LimitsRepository);
iocContainer.bind<LimitsControlMiddleware>(TYPES.LimitsControlMiddleware).to(LimitsControlMiddleware);
//emailsQueue
iocContainer.bind<EmailService>(TYPES.EmailService).to(EmailService);
iocContainer.bind<NotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
//Scheduler
iocContainer.bind<Scheduler>(TYPES.Scheduler).to(Scheduler);
//Auth
iocContainer.bind<AuthService>(TYPES.AuthService).to(AuthService);
//models
iocContainer.bind<mongoose.Model<BloggerType>>(TYPES.bloggersModel).toConstantValue(bloggersModel);
iocContainer.bind<mongoose.Model<PostType>>(TYPES.postsModel).toConstantValue(postsModel);
iocContainer.bind<mongoose.Model<UserType>>(TYPES.usersModel).toConstantValue(usersModel);
iocContainer.bind<mongoose.Model<CommentType>>(TYPES.commentsModel).toConstantValue(commentsModel);
iocContainer.bind<mongoose.Model<LimitsControlType>>(TYPES.limitsModel).toConstantValue(limitsModel);
iocContainer.bind<mongoose.Model<EmailConfirmationMessageType>>(TYPES.emailsQueueModel).toConstantValue(emailsQueueModel);
