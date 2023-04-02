import { Server } from 'http'
import request from 'supertest'
import { App } from '../../src/app'
import CreateDemo from '../../src/application/demo/create/create-demo'
import { Category } from '../../src/domain/category/category'
import { CategoryRepository } from '../../src/domain/category/repository/category-repository'
import { Product } from '../../src/domain/product/product'
import { ProductRepository } from '../../src/domain/product/repository/product-repository'
import { StoreRepository } from '../../src/domain/store/repository/store-repository'
import { Store } from '../../src/domain/store/store'
import { UserRepository } from '../../src/domain/user/repository/user-repository'
import { User } from '../../src/domain/user/user'

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
        id: CreateDemo.FIXTURES.products[0].id,
        attributes: {
          name: 'product-name'
        },
        relationships: {
          category: {
            id: CreateDemo.FIXTURES.categories[0].id
          }
        }
      }
    }
  }

  async function givenExistingUser(id: string, name: string): Promise<void> {
    const userRepository = app.getContainer().get<UserRepository>('userRepository')

    await userRepository.save(new User(id, name))
  }

  async function givenExistingCategory(id: string, name: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category(id, name))
  }

  async function givenExistingStore(id: string, name: string, userId: string): Promise<void> {
    const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

    await storeRepository.save(new Store(id, name, userId))
  }

  async function givenExistingProduct(id: string, categoryId: string, storeId: string): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product(id, 'product-name', categoryId, storeId))
  }

  test('When not existing category id returns 404 status code', async () => {
    // Given
    await givenExistingUser(CreateDemo.FIXTURES.user.id, 'user-name')
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.user.id)
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When not existing store id returns 404 status code', async () => {
    // Given
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 201 status code', async () => {
    // Given
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.user.id)
    await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When existing product id returns 400 status code', async () => {
    // Given
    await givenExistingUser(CreateDemo.FIXTURES.user.id, 'user-name')
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.user.id)
    await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
    await givenExistingProduct(CreateDemo.FIXTURES.products[0].id, CreateDemo.FIXTURES.categories[0].id, CreateDemo.FIXTURES.store.id)
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
