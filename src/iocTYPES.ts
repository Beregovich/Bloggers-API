import {IPostsRepository, PostsService} from "./domain/posts-service";
import {PostsRepository} from "./repositories/mongoose/posts-mongoose-repository";

export const TYPES = {
    //bloggers
    IBloggersRepository: Symbol.for("IBloggersRepository"),
    BloggersService: Symbol.for("BloggersService"),
    BloggersRepository: Symbol.for("BloggersRepository"),
    //posts
    IPostsRepository: Symbol.for("IPostsRepository"),
    PostsService: Symbol.for("PostsService"),
    PostsRepository: Symbol.for("PostsRepository"),
    //models
    bloggersModel: Symbol.for("bloggersModel"),
    postsModel: Symbol.for("postsModel"),
}