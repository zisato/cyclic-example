import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../src/app'
import { Category } from '../../../../src/domain/category/category'
import { CategoryRepository } from '../../../../src/domain/category/repository/category-repository'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'

describe('Create Category acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/categories/create'

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('express.port'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenValidRequestBody(): any {
    return {
      attributes: {
        name: 'category-name'
      }
    }
  }

  async function givenExistingCategory(id: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category({ id: new UuidV1(id), name: 'category-name' }))
  }

  describe('GET method', () => {
    test('When valid request returns 200 status code', async () => {
      // When
      const response = await request(server).get(route).send()
  
      // Then
      const expectedStatusCode = 200
      expect(response.statusCode).toEqual(expectedStatusCode)
    })
  })

  describe('POST method', () => {
    test('Redirect to list categories when created', async () => {
      // Given
      const requestBody = givenValidRequestBody()
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 302
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    test('When existing category id returns 400 status code', async () => {
      // Given
      await givenExistingCategory('1a3e9968-bba5-11ed-afa1-0242ac120002')
      const requestBody = givenValidRequestBody()
      jest.spyOn(UuidV1, 'create').mockReturnValue(new UuidV1('1a3e9968-bba5-11ed-afa1-0242ac120002'))
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 400
      expect(response.statusCode).toEqual(expectedStatusCode)
    })
  })
})
