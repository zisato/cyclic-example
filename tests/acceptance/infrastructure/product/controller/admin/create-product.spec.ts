import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../../src/app'
import CreateDemo from '../../../../../../src/application/demo/create/create-demo'
import { Category } from '../../../../../../src/domain/category/category'
import { CategoryRepository } from '../../../../../../src/domain/category/repository/category-repository'
import { Product } from '../../../../../../src/domain/product/product'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'
import { StoreRepository } from '../../../../../../src/domain/store/repository/store-repository'
import { Store } from '../../../../../../src/domain/store/store'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import { onePixelTransparentPng } from '../../../../../helpers/image-mock'
import { mockClient } from 'aws-sdk-client-mock'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

describe('Create Product acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const s3Mock = mockClient(S3Client)

  beforeEach(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = app.startServer(parameters.get<number>('express.port'))
  })

  afterEach(async () => {
    app.shutdown()
    server = null
  })

  function givenRoute(): string {
    return '/admin/products/create'
  }

  function givenValidRequestBody(): any {
    return {
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

    await productRepository.save(new Product({ id: new UuidV1(id), name: 'product-name', categoryId: new UuidV1(categoryId), storeId: new UuidV1(storeId), imageFilename: null }))
  }

  describe('GET method', () => {
    test('When valid request returns 200 status code', async () => {
      // Given
      const route = givenRoute()
      await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')

  
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
      await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
      await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
      const route = givenRoute()
      const requestBody = givenValidRequestBody()
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 302
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    test('Create with image', async () => {
      // Given
      await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
      await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
      const route = givenRoute()
      s3Mock.on(PutObjectCommand).resolves({})
  
      // When
      const response = await request(server)
        .post(route)
        .field('attributes.name', 'product-name')
        .field('relationships.category.id', CreateDemo.FIXTURES.categories[0].id)
        .attach('attributes.image', Buffer.from(onePixelTransparentPng, 'base64'))
        .set('Content-Type', 'multipart/form-data')
  
      // Then
      const expectedStatusCode = 302
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    test('When not existing category id returns 404 status code', async () => {
      // Given
      await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
      const route = givenRoute()
      const requestBody = givenValidRequestBody()
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 404
      expect(response.statusCode).toEqual(expectedStatusCode)
    })

    test('When not existing store id returns 404 status code', async () => {
      // Given
      await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
      const route = givenRoute()
      const requestBody = givenValidRequestBody()
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 404
      expect(response.statusCode).toEqual(expectedStatusCode)
    })
  
    test('When existing product id returns 400 status code', async () => {
      // Given
      const route = givenRoute()
      await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
      await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
      await givenExistingProduct(CreateDemo.FIXTURES.products[0].id, CreateDemo.FIXTURES.categories[0].id, CreateDemo.FIXTURES.store.id)
      const requestBody = givenValidRequestBody()
      jest.spyOn(UuidV1, 'create').mockReturnValueOnce(new UuidV1(CreateDemo.FIXTURES.products[0].id))
  
      // When
      const response = await request(server).post(route).send(requestBody)
  
      // Then
      const expectedStatusCode = 400
      expect(response.statusCode).toEqual(expectedStatusCode)
    })
  })
})
