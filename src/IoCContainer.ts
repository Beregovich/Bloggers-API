import { Container } from "inversify";
import {IBloggersRepository} from "./domain/bloggers-service";
import {ICommentRepository} from "./domain/comments-service";
import {IPostsRepository} from "./domain/posts-service";
import {IUsersRepository} from "./domain/users-service";

export const TYPES = {
    IBloggersRepository: Symbol.for("IBloggersRepository"),
    ICommentRepository: Symbol.for("ICommentRepository"),
    IPostsRepository: Symbol.for("IPostsRepository"),
    IUsersRepository: Symbol.for("IUsersRepository"),

}

const myContainer = new Container()