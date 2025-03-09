const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  const successNotification = page.locator('.success')
  await successNotification.waitFor({ state: 'visible' }) 
  await successNotification.waitFor({ state: 'detached' })
}

const removeBlog = async (page, title) => {
  page.on('dialog', async dialog => {
    await dialog.accept()
  })
  const otherBlogElement = await page.locator('.onlyTitleAuthor').filter({ hasText: title })
  await otherBlogElement.getByRole('button').click()
  await page.getByRole('button', { name: 'remove' }).click()

  await page.locator('.allContent').filter({ hasText: title }).waitFor({ state: 'detached' })
}

export { loginWith, createBlog, removeBlog }