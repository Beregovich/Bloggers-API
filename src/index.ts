import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {removeAll} from "./application/common";
import {iocContainer} from "./IocContainer";
import {runDb} from "./repositories/db";
import {TYPES} from "./iocTYPES";
import {Scheduler} from "./application/email-sending-scheduler";
import cookieParser from "cookie-parser";

const jsonBodyMiddleware = bodyParser.json()
const app = express()
const port = process.env.PORT || 5000
//const urlValidator = /^(http(s)?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[/a-zA-Z0-9_-]+$/
const scheduler = iocContainer.get<Scheduler>(TYPES.Scheduler)
app.set('trust proxy', true);
app.use(jsonBodyMiddleware)
app.use(cors())
app.use(cookieParser())
app.use('/api/bloggers', bloggersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/auth', authRouter)

app.delete('/api/testing/all-data', (req: Request, res: Response) => {
    removeAll().then(() => res.sendStatus(204))
})
//Home
app.get('/*', (req: Request, res: Response) => {
    res.send({
        "/api/bloggers": "GET, POST",
        "/api/bloggers/:postId": "GET, PUT, DELETE",
        "/api/posts": "GET, POST",
        "/api/posts/:postId": "GET, PUT, DELETE"
    })
})

async function startServer() {
    await runDb()
    await scheduler.emailSenderRun()
    await app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer().then(() => console.log('Done'))