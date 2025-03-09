import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    updateLikes(blog.id, blogObject)
  }

  const handleDelete = () => {
    deleteBlog(blog.id)
  }

  const deleteButton = () => {
    if (blog.user.username === user.username) {
      return (
        <button onClick={handleDelete}>remove</button>
      )
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div className='onlyTitleAuthor' style={hideWhenVisible}>
        <span>{blog.title}</span> <span>{blog.author}</span> <button onClick={toggleVisibility}>view</button>
      </div>
      <div className='allContent' style={showWhenVisible}>
        <span>{blog.title}</span> <span>{blog.author}</span> <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div>
          {deleteButton()}
        </div>
      </div>
    </div>
  )
}

export default Blog