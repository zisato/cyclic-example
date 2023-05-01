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
import { UuidV1 } from '../../src/infrastructure/identity/uuid-v1'
import { Seller } from '../../src/domain/seller/seller'
import { SellerRepository } from '../../src/domain/seller/repository/seller-repository'

describe('Product acceptance test', () => {
  let server: Server | null = null
  const app = new App()

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('express.port'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenRoute(storeId: string): string {
    return `/stores/${storeId}/products`
  }

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

  async function givenExistingSeller(id: string, name: string): Promise<void> {
    const sellerRepository = app.getContainer().get<SellerRepository>('sellerRepository')

    await sellerRepository.save(new Seller({ id: new UuidV1(id), name }))
  }

  async function givenExistingCategory(id: string, name: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category({ id: new UuidV1(id), name }))
  }

  async function givenExistingStore(id: string, name: string, sellerId: string): Promise<void> {
    const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

    await storeRepository.save(new Store({ id: new UuidV1(id), name, sellerId: new UuidV1(sellerId) }))
  }

  async function givenExistingProduct(id: string, categoryId: string, storeId: string): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product({ id: new UuidV1(id), name: 'product-name', categoryId: new UuidV1(categoryId), storeId: new UuidV1(storeId), image: null }))
  }

  test('When not existing category id returns 404 status code', async () => {
    // Given
    await givenExistingSeller(CreateDemo.FIXTURES.seller.id, 'seller-name')
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
    const route = givenRoute(CreateDemo.FIXTURES.store.id)
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When not existing store id returns 404 status code', async () => {
    // Given
    const route = givenRoute(CreateDemo.FIXTURES.store.id)
    const requestBody = givenValidRequestBody()

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 201 status code', async () => {
    // Given
    const route = givenRoute(CreateDemo.FIXTURES.store.id)
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
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
    const route = givenRoute(CreateDemo.FIXTURES.store.id)
    await givenExistingSeller(CreateDemo.FIXTURES.seller.id, 'seller-name')
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
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
