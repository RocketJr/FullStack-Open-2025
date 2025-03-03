const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
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
      const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'hola'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'New blog from test',
        author: 'New author from test',
        url: 'http://newurl.com',
        likes: 25
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      const newUser = {
        username: 'testuser2',
        name: 'Test User2',
        password: 'hola2'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'New blog from test part 2',
        author: 'New author from test part 2',
        url: 'http://newurlpart2.com'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const likes = response.body.map(blog => blog.likes)

      assert(likes.includes(0))
    })

    test('if title or url is missing, it will return 400', async () => {
      const newUser = {
        username: 'testuser3',
        name: 'Test User3',
        password: 'hola3'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        author: 'New author from test part 3',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('if token is missing, it will return 401', async () => {
      const newBlog = {
        title: 'New blog from test part 4',
        author: 'New author from test part 4',
        url: 'http://newurlpart4.com',
        likes: 10
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
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
      const newUser = {
        username: 'testuser5',
        name: 'Test User5',
        password: 'hola5'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const loginResponse = await api
        .post('/api/login')
        .send({ username: newUser.username, password: newUser.password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'New blog from test part 5',
        author: 'New author from test part 5',
        url: 'http://newurlpart5.com',
        likes: 10
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = response.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(blog => blog.title)

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      assert(!titles.includes('New blog from test part 5'))
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rocketjr',
      name: 'Leonardo Rikhardsson',
      password: 'holymoly',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'holymoly',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})