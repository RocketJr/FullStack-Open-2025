const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, removeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
        data: {
            name: 'Leonardo Rikhardsson',
            username: 'rocketjr',
            password: 'rikhardsson'
        }
    })
    await request.post('/api/users', {
        data: {
            name: 'John Doe',
            username: 'johndoe',
            password: 'doe'
        }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'rocketjr', 'rikhardsson')
      
      await expect(page.getByText('Leonardo Rikhardsson logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'rocketjr', 'wrong')
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Leonardo Rikhardsson logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'rocketjr', 'rikhardsson')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'the best test', 'LR', 'https://rocketjr.github.io')
      await expect(page.getByText('the best test').first()).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'the best test', 'LR', 'https://rocketjr.github.io')
        await createBlog(page, 'the second best test', 'LR', 'https://rocketjr.github.io')
        await createBlog(page, 'the third best test', 'LR', 'https://rocketjr.github.io')
      })

      test('it can be liked', async ({ page }) => {
        const otherBlogElement = await page.locator('.onlyTitleAuthor').filter({ hasText: 'the second best test' })

        await otherBlogElement.getByRole('button').click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('it can be deleted', async ({ page }) => {
        await removeBlog(page, 'the second best test')
        await expect(page.getByText('the second best test')).not.toBeVisible()
      })

      test('it can be deleted only by the user who created it', async ({ page }) => {
        const otherBlogElement = await page.locator('.onlyTitleAuthor').filter({ hasText: 'the third best test' })

        await otherBlogElement.getByRole('button').click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'johndoe', 'doe')
        await otherBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        const firstBlog = await page.locator('.blog').filter({ hasText: 'the best test' })
        const secondBlog = await page.locator('.blog').filter({ hasText: 'the second best test' })
        const thirdBlog = await page.locator('.blog').filter({ hasText: 'the third best test' })

        await firstBlog.getByRole('button').click()
        await secondBlog.getByRole('button').click()
        await thirdBlog.getByRole('button').click()

        await secondBlog.getByRole('button', { name: 'like' }).click()
        await expect(page.locator('.blog').first()).toContainText('the second best test')
        await expect(page.locator('.blog').nth(2)).toContainText('the third best test')
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await expect(page.locator('.blog').nth(1)).toContainText('the third best test')
        await thirdBlog.getByRole('button', { name: 'like' }).click()
        await expect(page.locator('.blog').first()).toContainText('the third best test')
        await expect(page.locator('.blog').nth(1)).toContainText('the second best test')
        await expect(page.locator('.blog').nth(2)).toContainText('the best test')
      })
    })
  })
})