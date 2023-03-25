import { Server } from 'http'
import request from 'supertest'
import { App } from '../../src/app'
import { Category } from '../../src/domain/category/category'
import { CategoryRepository } from '../../src/domain/category/repository/category-repository'

describe('Category acceptance test', () => {
  const route = '/categories'
  let server: Server | null = null
  const app = new App()

  beforeAll(async () => {
    server = await app.startServer()
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenValidRequestBody(): any {
    return {
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {
          name: 'category-name'
        }
      }
    }
  }

  async function givenExistingCategory(id: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category(id, 'category-name'))
  }

  test('When valid request returns 200 status code', async () => {
    // Given
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When existing category id returns 400 status code', async () => {
    // Given
    await givenExistingCategory('1a3e9968-bba5-11ed-afa1-0242ac120002')
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
