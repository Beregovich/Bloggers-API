import {Container} from "inversify";
import {BloggersService, IBloggersRepository} from "./domain/bloggers-service";
import {BloggersRepository} from "./repositories/bloggers-db-repository";
import {bloggersCollection, limitsCollection, postsCollection} from "./repositories/db";
import "reflect-metadata";
import {TYPES} from "./iocTYPES";
import {LimitsRepository} from "./repositories/limits-db-repository";
import {emailService} from "./domain/notification-service";
import {Scheduler} from "./application/email-sending-scheduler";

export const myContainer = new Container();

export const bloggersRepository = new BloggersRepository(bloggersCollection, postsCollection)
export const bloggersService = new BloggersService(bloggersRepository)
export const limitsRepository = new LimitsRepository(limitsCollection)
export const scheduler = new Scheduler(emailService)

myContainer.bind<IBloggersRepository>(TYPES.IBloggersRepository).to(BloggersRepository);
myContainer.bind<BloggersService>(TYPES.BloggersService).to(BloggersService);
myContainer.bind<BloggersRepository>(TYPES.BloggersRepository).toConstantValue(bloggersRepository)
myContainer.bind<LimitsRepository>(TYPES.LimitsRepository).toConstantValue(limitsRepository)
//myContainer.bind<ILimitsRepository>(TYPES.ILimitsRepository).to(LimitsRepository);
//myContainer.bind<LimitsControlService>(TYPES.LimitsControlService).to(LimitsControlService);
//myContainer.get<BloggersService>(TYPES.BloggersService)
