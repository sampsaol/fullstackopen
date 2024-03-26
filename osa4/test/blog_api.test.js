const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const TOKEN = 'secretvalue'
const api = supertest(app)
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe.only('when there are initially some blogs saved', () => {  
  var token = ''
  var user = {}
  before(async () => {
    await User.deleteMany({})
    const testUser = await api
      .post('/api/users')
      .send(helper.initialUser)
      .expect(201)
    const res = await api
      .post('/api/login')
      .send(helper.initialUser)
      .expect(200)
    token = `Bearer ${res.body.token}`
    user = await User.findOne({username: helper.initialUser.username})
  })
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogsToSave = helper.initialBlogs.map(r => {
      return {...r, user: user._id}
    })
    await Blog.insertMany(blogsToSave)
    //const currentBlogs = await helper.blogsInDb()
    //user.blogs = user.blogs.concat(currentBlogs[0]._id)
    //user.blogs = user.blogs.concat(currentBlogs[1]._id)
    //await user.save()
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

  describe('blogs are added correctly', () => {
    test('blogs can be added with POST request', async () => {
      const newBlog = {
        title: "testblog is nice to test",
        author: "testo testman",
        url: "cledos university",
        user: user._id
      }
      const blogsAtStart = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
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
          url: "cledos university",
          user: user._id
        }
        await api
          .post('/api/blogs')
          .set('Authorization', token)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.likes).slice(-1)
        assert.strictEqual(contents[0], 0)
    })

    test('if title is not given, new blog wont be posted', async () => {
      const newBlog = {
        author: "TestMan",
        url: "www.thisdoesexist.com",
        user: user._id
      }
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('if url not given, blog is not posted', async () => {
      const newBlog = {
        title: "kebab tastes tasty",
        author: "TestMan",
        user: user._id
      }
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog works properly', () => {
    test('succeeds with status code 204 when id is correct', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', token)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      const blogIds = blogsAtEnd.map(r => r.id)
      assert(!blogIds.includes(blogToDelete.id))
    })
  })

  describe('updating blogs works properly', () => {
    test('blogs are updated correctly', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = {...blogsAtStart[0], likes: 10}

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', token)
        .send(blogToUpdate)
        .expect(200)
      
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd[0].likes, 10)
    })
  })
  describe('token acts correctly', () => {
    test('a request without token gets denied with 401', async () => {
      const newBlog = {
        title: "testblog is nice to test",
        author: "testo testman",
        url: "cledos university",
        user: user._id
      }
      const blogsAtStart = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
  
      const response = await api.get('/api/blogs')
      const contents = response.body.map(r => r.title)
  
      assert(!(contents.includes('testblog is nice to test')))
      assert(contents.length === blogsAtStart.length)
  
    })
  })
})



describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('salainensana', 10)
    const user = new User({ username: 'root', passwordHash})

    await user.save()
  })

  test('creation succeeds with an unique username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'keittokeisari',
      name: 'Kevin Testaaja',
      password: 'sanosalasana'
    }
    
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length)
  })
  describe('creation requires a valid username and password')
    test('creation does not succeed with a duplicate username', async () => {
      const usersAtStart = await helper.usersInDb()

      const duplicateUser = {
        username: 'root',
        name: 'Ei Läpi',
        password: 'salaista'
      }

      const result = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
    
    test('creation does not succeed with a too short username', async () => {
      const usersAtStart = await helper.usersInDb()

      const duplicateUser = {
        username: 'ro',
        name: 'Ei Läpi',
        password: 'salaista'
      }

      const result = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('User validation failed:'))

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation does not succeed with password missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'helka',
        name: 'Heli Kanerva'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password too short or missing'))

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('creation does not succeed with a too short password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'helka',
        name: 'Heli Kanerva',
        password: "12"
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password too short or missing'))

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})



after(async () => {
  await mongoose.connection.close()
})