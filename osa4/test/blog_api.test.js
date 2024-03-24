const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const TestAgent = require('supertest/lib/agent')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('blogs are identified by .id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  assert(blogToView.id)
})

test('blogs can be added with POST request', async () => {
  const newBlog = {
    title: "testblog is nice to test",
    author: "testo testman",
    url: "cledos university"
  }

  const blogsAtStart = await helper.blogsInDb()
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)

  assert(contents.includes('testblog is nice to test'))
  assert(contents.length === blogsAtStart.length + 1)
})

test('if no like value is given, the like value is 0', async () => {
  const newBlog = {
      title: "testblog is nice to test",
      author: "testo testman",
      url: "cledos university"
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.likes).slice(-1)
    assert.strictEqual(contents[0], 0)
})

test.only('if title is not given, new blog wont be posted', async () => {
  const newBlog = {
    author: "TestMan",
    url: "www.thisdoesexist.com"
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('if url not given, blog is not posted', async () => {
  const newBlog = {
    title: "kebab tastes tasty",
    author: "TestMan"
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})


after(async () => {
  await mongoose.connection.close()
})