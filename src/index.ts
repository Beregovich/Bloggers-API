import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'


const jsonBodyMiddleware = bodyParser.json()
const app = express()
const port = process.env.PORT || 5000
const urlValidator = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/

app.use(jsonBodyMiddleware)
app.use(cors())

type PostType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
    blog: BloggerType | null | undefined;
}

type BloggerType = {
    id: number;
    name: string | null;
    youtubeUrl: string | null;
    posts: BloggersPostType[];
}

type BloggersPostType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
}

const updateBloggersPosts = (bloggerId: number): BloggersPostType[] => {
    let personalPosts: BloggersPostType[] = []
    let filteredPosts: PostType[] = posts.filter(p => p.blogId === bloggerId)
    filteredPosts.forEach(e=>{
        personalPosts.push({
            id: e.id,
            title: e.title,
            shortDescription: e.shortDescription,
            content: e.content,
            blogId: e.blogId
        })
    })
    return personalPosts
}

let posts: PostType[] = [
    {id: 1, title: 'Rahaz', shortDescription: '', content: '', blogId: 1, blog: null},
    {id: 2, title: 'Adlitam', shortDescription: '', content: '', blogId: 2, blog: null}
]

let bloggers: BloggerType[] = [
    {id: 1, name: 'Zahar', youtubeUrl: 'https://youtube.com/zahar', posts: []},
    {id: 2, name: 'Matilda', youtubeUrl: 'https://youtube.com/matilda', posts: []},
]

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
            youtubeUrl: req.body.youtubeUrl,
            posts: []
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
    } else if(!urlValidator.test(req.body.youtubeUrl)
        || !id
        || req.body.name.length < 2){
        res.send(400)
    }else {
        blogger.name = req.body.name
        blogger.youtubeUrl = req.body.youtubeUrl
        res.send(204)
    }
})
//Delete blogger specified by id
app.delete('/api/bloggers/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const newBloggers = bloggers.filter(b => b.id != id)
    if (newBloggers.length < bloggers.length ) {
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
    if (!req.body.shortDescription || req.body.shortDescription.length > 100
        || !req.body.content || !req.body.title) {
        res.send(400)
    } else if(!blogger){
        res.send(400)
    }else {
        const newPost: PostType = {
            id: +(new Date()),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blog: blogger
        }
        posts.push(newPost)
        blogger.posts = updateBloggersPosts(req.body.blogId)
        res.send(newPost)
    }

})
//Return post by id
app.get('/api/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId
    const blogger = posts.find(p => p.id === id)
    if (blogger) {
        res.send(blogger)
    } else {
        res.send(404)
    }
})
//Update existing post by id with InputModel
app.put('/api/posts/:postsId', (req: Request, res: Response) => {
    const id = +req.params.postsId
    const post = posts.find(p => p.id === id)
    if (post) {
        post.title = req.body.title
        post.shortDescription = req.body.youtubeUrl
        post.content = req.body.content
        res.send(post)
    } else {
        res.send(404)
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
    res.send('Endpoint')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})