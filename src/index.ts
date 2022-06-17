import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {bloggersRouter} from "./routes/bloggers-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from "./routes/comments-router";
import {removeAll} from "./application/common";
const jsonBodyMiddleware = bodyParser.json()
const app = express()
const port = process.env.PORT || 5000
//const urlValidator = /^(http(s)?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[/a-zA-Z0-9_-]+$/

app.set('trust proxy', true);
app.use(jsonBodyMiddleware)
app.use(cors())
app.use('/api/bloggers', bloggersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/auth', authRouter)

app.delete('/api/testing/all-data', (req: Request, res: Response) => {
    removeAll().then(()=>res.sendStatus(204))
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
    await app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer()