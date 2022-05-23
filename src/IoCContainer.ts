import { Container } from "inversify";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {ICommentRepository} from "./domain/comments-service";
import {IPostsRepository} from "./domain/posts-service";
import {IUsersRepository} from "./domain/users-service";
import {BloggersRepository} from "./repositories/bloggers-db-repository";
import {bloggersCollection, postsCollection} from "./repositories/db";

export const bloggersRepository = new BloggersRepository(bloggersCollection, postsCollection)
export const bloggersService = new BloggersService(bloggersRepository)

export const TYPES = {
    IBloggersRepository: Symbol.for("IBloggersRepository"),
    BloggersService: Symbol.for("BloggersService"),
    bloggersCollection: Symbol.for("bloggersCollection"),
    ICommentRepository: Symbol.for("ICommentRepository"),
    IPostsRepository: Symbol.for("IPostsRepository"),
    IUsersRepository: Symbol.for("IUsersRepository"),

}
export const myContainer = new Container();
myContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository);
myContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
myContainer.get<BloggersService>(TYPES.BloggersService)