const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
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

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  describe('viewing a specific blog', () => {
    test('all blogs have a field named id', async () => {
      const response = await api.get('/api/blogs')
      response.body.forEach(blog => {
        assert(blog.id)
      })
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New blog from test',
        author: 'New author from test',
        url: 'http://newurl.com',
        likes: 25
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const titles = response.body.map(blog => blog.title)
      const authors = response.body.map(blog => blog.author)
      const urls = response.body.map(blog => blog.url)
      const likes = response.body.map(blog => blog.likes)

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      assert(titles.includes('New blog from test'))
      assert(authors.includes('New author from test'))
      assert(urls.includes('http://newurl.com'))
      assert(likes.includes(25))
    })

    test('if likes is missing, it will default to 0', async () => {
      const newBlog = {
        title: 'New blog from test part 2',
        author: 'New author from test part 2',
        url: 'http://newurlpart2.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const likes = response.body.map(blog => blog.likes)

      assert(likes.includes(0))
    })

    test('if title or url is missing, it will return 400', async () => {
      const newBlog = {
        author: 'New author from test part 3',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = { likes: 30 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const updatedLikes = blogsAtEnd.map(blog => blog.likes)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      assert(updatedLikes.includes(30))
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})