const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { username: 1, name: 1})

	response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	await console.log(decodedToken)
	const user = await request.user

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user._id
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	const user = await request.user
	if (!(blog.user.toString() === user._id.toString())) {
		return response.status(401).json({ error: 'token invalid' })
	}
	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
	const body = request.body
	const blogFinder = await Blog.findById(request.params.id)
	const user = await request.user
	if (!(user._id.toString() === blogFinder.user.toString())) {
		return response.status(401).json({ error: 'token invalid' })
	}
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	response.json(updatedBlog)
})


module.exports = blogRouter