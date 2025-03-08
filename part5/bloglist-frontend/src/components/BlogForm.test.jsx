import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'This is a test Title')
  await user.type(authorInput, 'This is a test Author')
  await user.type(urlInput, 'This is a test URL')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('This is a test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('This is a test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('This is a test URL')
})