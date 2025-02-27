const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0])

  return blogs.length === 0
    ? null
    : {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
}

const _ = require('lodash')

const mostBlogs = (blogs) => {
  const authorGroups = _.groupBy(blogs, 'author')
  const authorBlogs = _.map(authorGroups, (blogs, author) => ({ author, blogs: blogs.length }))
  const mostAuthor = _.maxBy(authorBlogs, 'blogs')

  return blogs.length === 0
    ? null
    : {
      author: mostAuthor.author,
      blogs: mostAuthor.blogs
    }
}

const mostLikes = (blogs) => {
  const authorGroups = _.groupBy(blogs, 'author')
  const authorLikes = _.map(authorGroups, (blogs, author) => ({ author, likes: totalLikes(blogs) }))
  const mostAuthor = _.maxBy(authorLikes, 'likes')

  return blogs.length === 0
    ? null
    : {
      author: mostAuthor.author,
      likes: mostAuthor.likes
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}