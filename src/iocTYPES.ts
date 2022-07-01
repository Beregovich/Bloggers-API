import {IPostsRepository, PostsService} from "./domain/posts-service";
import {PostsRepository} from "./repositories/mongoose/posts-mongoose-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsRepository} from "./repositories/mongoose/comments-mongoose-repository";
import {LimitsRepository} from "./repositories/mongoose/limits-mongoose-repository";
import {EmailService} from "./domain/notification-service";
import {LimitsControlMiddleware} from "./middlewares/limit-control-middleware";
import {CheckRefreshTokenMiddleware} from "./middlewares/check-refresh-token-middleware";

export const TYPES = {
    //bloggers
    IBloggersRepository: Symbol.for("IBloggersRepository"),
    BloggersService: Symbol.for("BloggersService"),
    BloggersRepository: Symbol.for("BloggersRepository"),
    //posts
    IPostsRepository: Symbol.for("IPostsRepository"),
    PostsService: Symbol.for("PostsService"),
    PostsRepository: Symbol.for("PostsRepository"),
    //users
    IUsersRepository: Symbol.for("IUsersRepository"),
    // UsersRepository: Symbol.for("UsersRepository"),
    UsersService: Symbol.for("UsersService"),
    //comments
    CommentsService: Symbol.for("CommentsService"),
    CommentsRepository: Symbol.for("CommentsRepository"),
    //limits
    LimitsControlMiddleware: Symbol.for("LimitsControlMiddleware"),
    LimitsRepository: Symbol.for("LimitsRepository"),
    //notification
    EmailService: Symbol.for("EmailService"),
    NotificationRepository: Symbol.for("NotificationRepository"),
    //Auth
    AuthService: Symbol.for("AuthService"),
    //Scheduler
    Scheduler: Symbol.for("Scheduler"),
    //middlewares
    CheckRefreshTokenMiddleware: Symbol.for("CheckRefreshTokenMiddleware"),
    //models
    bloggersModel: Symbol.for("bloggersModel"),
    postsModel: Symbol.for("postsModel"),
    usersModel: Symbol.for("usersModel"),
    commentsModel: Symbol.for("commentsModel"),
    limitsModel: Symbol.for("limitsModel"),
    emailsQueueModel: Symbol.for("emailsQueueModel"),
}