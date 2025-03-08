import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' }
  }

  const user = { username: 'testuser', name: 'Test User' }

  const mockHandler = vi.fn()

  let container

  beforeEach(() => {
    container = render(
      <Blog blog={blog} updateLikes={mockHandler} deleteBlog={mockHandler} user={user} />
    ).container
  })

  test('renders title and author, but not url or likes by default', () => {
    const div = container.querySelector('.onlyTitleAuthor')
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library Test Author'
    )
    expect(div).not.toHaveTextContent('http://testurl.com')
    expect(div).not.toHaveTextContent('likes 5')
  })

  test('clicking the button shows url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.allContent')
    expect(div).toHaveTextContent('http://testurl.com')
    expect(div).toHaveTextContent('likes 5')
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})