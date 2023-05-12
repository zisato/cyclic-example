import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../src/app'
import CreateDemo from '../../../../src/application/demo/create/create-demo'
import { Category } from '../../../../src/domain/category/category'
import { CategoryRepository } from '../../../../src/domain/category/repository/category-repository'
import { Product } from '../../../../src/domain/product/product'
import { ProductRepository } from '../../../../src/domain/product/repository/product-repository'
import { StoreRepository } from '../../../../src/domain/store/repository/store-repository'
import { Store } from '../../../../src/domain/store/store'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { onePixelTransparentPng } from '../../../helpers/image-mock'
import { Readable } from 'stream'
import { sdkStreamMixin } from '@aws-sdk/util-stream-node'

describe('List products acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const s3Mock = mockClient(S3Client)

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = app.startServer(parameters.get<number>('express.port'))
  })

  afterAll(async () => {
    app.shutdown()
    server = null
  })

  function givenRoute(storeId: string): string {
    return `/stores/${storeId}/products`
  }

  async function givenExistingCategory(id: string, name: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category({ id: new UuidV1(id), name }))
  }

  async function givenExistingStore(id: string, name: string, sellerId: string): Promise<void> {
    const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

    await storeRepository.save(new Store({ id: new UuidV1(id), name, sellerId: new UuidV1(sellerId) }))
  }

  async function givenExistingProduct(id: string, categoryId: string, storeId: string, imageFilename: string | null = null): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product({ id: new UuidV1(id), name: 'product-name', categoryId: new UuidV1(categoryId), storeId: new UuidV1(storeId), imageFilename }))
  }

  test('When valid request returns 200 status code', async () => {
    // Given
    const imageFilename = 'test-image-filename'
    const route = givenRoute(CreateDemo.FIXTURES.store.id)
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
    await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
    await givenExistingProduct(CreateDemo.FIXTURES.products[0].id, CreateDemo.FIXTURES.categories[0].id, CreateDemo.FIXTURES.store.id, imageFilename)
    const stream = new Readable()
    stream.push(onePixelTransparentPng)
    stream.push(null)
    const sdkStream = sdkStreamMixin(stream);
    const getObjectCommandOutput = {
      Body: sdkStream,
      Metadata: {
        name: 'filename',
        mimeType: 'image/png',
        size: stream.readableLength.toString()
      }
    }
    s3Mock.on(GetObjectCommand).resolves(getObjectCommandOutput)

    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedStatusCode = 200
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
