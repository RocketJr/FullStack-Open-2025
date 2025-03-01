const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'First author',
    url: 'http://firsturl.com',
    likes: 10
  },
  {
    title: 'Second blog',
    author: 'Second author',
    url: 'http://secondurl.com',
    likes: 20
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'willremovethissoon', url: 'willremovethissoon', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}