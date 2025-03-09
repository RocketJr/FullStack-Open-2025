import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            placeholder='Title'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type="text"
            value={newAuthor}
            onChange={handleAuthorChange}
            placeholder='Author'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type="text"
            value={newUrl}
            onChange={handleUrlChange}
            placeholder='URL'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm