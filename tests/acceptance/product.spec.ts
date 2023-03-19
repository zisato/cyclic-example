import { Server } from 'http'
import request from 'supertest'
import { App } from '../../src/app'
import { Product } from '../../src/domain/product/product'
import { ProductRepository } from '../../src/domain/product/repository/product-repository'

describe('Product acceptance test', () => {
  const route = '/products'
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
          name: 'product-name'
        }
      }
    }
  }

  async function givenExistingProduct(id: string): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product(id, 'product-name'))
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

  test('When existing product id returns 400 status code', async () => {
    // Given
    await givenExistingProduct('1a3e9968-bba5-11ed-afa1-0242ac120002')
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
