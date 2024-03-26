const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const passwordHash = bcrypt.hash('salainensana', 10)

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Yours Truly",
    url: "http://yykaakoo.com",
    likes: 12,
  },
  {
    title: "kebab is tasty",
    author: "Pizza Express",
    url: "http://eioleosoite.com",
    likes: 200,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const initialUser = {
  username: 'root',
  password: 'salainen'
}

module.exports= {
  initialBlogs, blogsInDb, usersInDb, initialUser
}