const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Yours Truly",
    url: "http://yykaakoo.com",
    likes: 12
  },
  {
    title: "kebab is tasty",
    author: "Pizza Express",
    url: "http://eioleosoite.com",
    likes: 200
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

module.exports= {
  initialBlogs, blogsInDb, usersInDb
}