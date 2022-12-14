import {Router, Request, Response} from "express";
import {bloggersService} from "../domain/bloggersService";
import {queryRepository} from "../queryRepository/queryRepository";
import {
    blogValidation,
    contentValidation,
    expressValidator,
    paginationValidation, shortDescriptionPostValidation,
    titlePostValidation,
} from "../middleware/expressValidator";
import {basicAuthMiddleware} from "../middleware/basicAuthMiddleware";
import {checkBearerAuthMiddleWare} from "../middleware/bearerAuthMiddleWare";


export const bloggersRouter = Router({})

bloggersRouter.post("/", basicAuthMiddleware, blogValidation, async (req: Request, res: Response) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const createNewBlog = await bloggersService.createNewBlog(name, description, websiteUrl)

    const {_id, ...createNewBlogCopy} = createNewBlog
    res.status(201).send(createNewBlogCopy)
})

bloggersRouter.get("/", paginationValidation, async (req: Request, res: Response) => {
    let searchNameTerm: any = req.query.searchNameTerm
    let pageNumber: any = req.query.pageNumber
    let pageSize: any = req.query.pageSize
    let sortBy: any = req.query.sortBy
    let sortDirection: any = req.query.sortDirection
    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc'

    const getAllBlogs = await queryRepository.getAllBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection)
    res.status(200).send(getAllBlogs)
})

bloggersRouter.get('/:id', async (req: Request, res: Response) => {
    const blogId = req.params.id
    const getBlogById = await queryRepository.getBlogById(blogId)
    if (!getBlogById) return res.sendStatus(404)
    res.status(200).send(getBlogById)
})


bloggersRouter.put('/:id', basicAuthMiddleware, blogValidation, async (req: Request, res: Response) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    const blogId = req.params.id
    const getBlogById = await queryRepository.getBlogById(blogId)
    if (!getBlogById) return res.sendStatus(404)
    await bloggersService.updateBlog(blogId, name, description, websiteUrl)

    res.sendStatus(204)
})

bloggersRouter.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
    const blogId = req.params.id
    const getBlogById = await queryRepository.getBlogById(blogId)
    if (!getBlogById) return res.sendStatus(404)
    await bloggersService.deleteBlog(blogId)
    res.sendStatus(204)
})

bloggersRouter.post('/:id/posts', basicAuthMiddleware, titlePostValidation, shortDescriptionPostValidation, contentValidation, expressValidator, async (req: Request, res: Response) => {
    const blogId = req.params.id
    const title = req.body.title
    const shortDescription = req.body.shortDescription
    const content = req.body.content

    const findBlog = await queryRepository.getBlogById(blogId)
    if (!findBlog) return res.sendStatus(404)

    const newCreatePost = await bloggersService.createNewBlogPosts(title, shortDescription, content, findBlog)
    const {_id, ...newCreatePostCopy} = newCreatePost

    res.status(201).send(newCreatePostCopy)
})

bloggersRouter.get('/:id/posts',checkBearerAuthMiddleWare, paginationValidation, async (req: Request, res: Response) => {
    const blogId = req.params.id
    const userId = req.user?.id
    const searchNameTerm: any = req.query.searchNameTerm
    const pageNumber: any = req.query.pageNumber
    const pageSize: any = req.query.pageSize
    const sortBy: any = req.query.sortBy
    let sortDirection: any = req.query.sortDirection
    if (sortDirection !== ('asc' || 'desc')) sortDirection = 'desc'


    const findBlog = await queryRepository.getBlogById(blogId)
    if (!findBlog) return res.sendStatus(404)

    const findBlogPosts = await queryRepository.findBlogPosts(blogId, searchNameTerm, pageNumber, pageSize, sortBy, sortDirection, userId)
    res.status(200).send(findBlogPosts)
})
