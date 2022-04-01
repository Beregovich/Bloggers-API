import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'


const jsonBodyMiddleware = bodyParser.json()
const app = express()
const port = process.env.PORT || 5000
//const urlValidator = /^(http(s)?:\/\/)?([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[/a-zA-Z0-9_-]+$/
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/


app.use(jsonBodyMiddleware)
app.use(cors())

class Problem {
    private type: string;
    private title: string;
    private status: number;
    private detail: string;
    private instance: string;

    constructor(type: string,
                title: string,
                status: number,
                detail: string,
                instance: string) {
        this.type = type;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }

}

type ProblemType = {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
}

type PostType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
    bloggerName: string | null;
}

type BloggerType = {
    id: number;
    name: string | null;
    youtubeUrl: string | null;
}

let posts: PostType[] = [
    {id: 1, title: 'lorem', shortDescription: '', content: 'lorem ipsum sens', blogId: 1, bloggerName: 'Zahar'},
    {id: 2, title: 'lorem', shortDescription: '', content: 'lorem ipsum sens', blogId: 2, bloggerName: 'Matilda'}
]

let bloggers: BloggerType[] = [
    {id: 1, name: 'Zahar', youtubeUrl: 'https://youtube.com'},
    {id: 2, name: 'Matilda', youtubeUrl: 'https://youtube.com'},
]

const updateBloggerName = (id: number, newName: string): void=>{
   let postToChange = posts.find(b=>b.blogId===id)
    if(postToChange)postToChange.bloggerName = newName
}

//---------------------------------Bloggers---------------------------------
//Returns all bloggers
app.get('/api/bloggers', (req: Request, res: Response) => {
    res.statusCode = 200;
    res.send(bloggers)
})
//Create new blogger
app.post('/api/bloggers', (req: Request, res: Response) => {
    if (!req.body.name && req.body.name.length < 1) {
        res.send(400)
    } else if (!urlValidator.test(req.body.youtubeUrl)) {
        res.send(400)
    } else {
        const newBlogger = {
            id: +(new Date()),
            name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
        }
        bloggers.push(newBlogger)
        res.statusCode = 201;
        res.send(newBlogger)
    }
})
//Returns blogger by id
app.get('/api/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    if (blogger) {
        res.statusCode = 200;
        res.send(blogger)
    } else {
        res.send(404)
    }
})
//Update existing Blogger by id with InputModel
app.put('/api/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        res.send(404)
    } else if (!urlValidator.test(req.body.youtubeUrl)
        && !id
        && req.body.name.length < 2) {
        res.send(400)
    } else {
        if (req.body.name) {
            blogger.name = req.body.name
            updateBloggerName(id, req.body.name)
        }
        if (req.body.youtubeUrl) blogger.youtubeUrl = req.body.youtubeUrl
        res.send(204)
    }
})
//Delete blogger specified by id
app.delete('/api/bloggers/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const newBloggers = bloggers.filter(b => b.id != id)
    if (newBloggers.length < bloggers.length) {
        bloggers = newBloggers
        res.send(204)
    } else {
        res.send(404)
    }
})

//---------------------------------Posts---------------------------------
//Returns all posts
app.get('/api/posts', (req: Request, res: Response) => {
    res.send(posts)
})
//Create new post
app.post('/api/posts', (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === req.body.blogId)
    if (!req.body.shortDescription && req.body.shortDescription.length > 100
        && !req.body.content && !req.body.title) {
        res.send(400)
    } else if (!blogger) {
        res.send(400)
    } else {
        const newPost: PostType = {
            id: +(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            bloggerName: blogger.name
        }
        posts.push(newPost)
        res.send(newPost)
    }

})
//Return post by id
app.get('/api/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const post = posts.find(p => p.id === id)
    if (post) {
        res.send(post)
    } else {
        res.send(404)
    }
})
//Update existing post by id with InputModel
app.put('/api/posts/:postsId', (req: Request, res: Response) => {
    const id = +req.params.postsId
    const post = posts.find(p => p.id === id)
    if (!post) {
        res.send(404)
    } else {
        if (req.body.title) post.title = req.body.title
        if (req.body.shortDescription) post.shortDescription = req.body.shortDescription
        if (req.body.content) post.content = req.body.content
        res.send(post)
    }
})

//Delete post specified by id
app.delete('/api/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const newPosts = posts.filter(p => p.id != id)
    if (newPosts.length < posts.length) {
        posts = newPosts
        res.send(204)
    } else {
        res.send(404)
    }
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})