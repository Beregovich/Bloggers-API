
export type PostType = {
    id: number;
    title: string | null;
    shortDescription: string | null;
    content: string | null;
    blogId: number;
    bloggerName?: string | null | undefined;
}

type BloggerType = {
    id: number;
    name: string | null;
    youtubeUrl: string | null;
}

export let posts: PostType[] = [
    {id: 1, title: 'lorem', shortDescription: '', content: 'lorem ipsum sens', blogId: 1},
    {id: 2, title: 'lorem', shortDescription: '', content: 'lorem ipsum sens', blogId: 2}
]

export let bloggers: BloggerType[] = [
    {id: 1, name: 'Zahar', youtubeUrl: 'https://youtube.com'},
    {id: 2, name: 'Matilda', youtubeUrl: 'https://youtube.com'},
]