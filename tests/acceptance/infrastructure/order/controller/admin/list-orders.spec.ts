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
import { OrderRepository } from '../../../../../../src/domain/order/repository/order-repository'
import { Order } from '../../../../../../src/domain/order/order'
import { OrderItem } from '../../../../../../src/domain/order/order-item'

describe('List orders acceptance test', () => {
  let server: Server | null = null
  const app = new App()

  beforeEach(() => {
    app.boot()
    const parameters = app.getParameters()
    server = app.startServer(parameters.get<number>('express.port'))
  })

  afterEach(() => {
    app.shutdown()
    server = null
  })

  function givenRoute(): string {
    return `/admin/orders`
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

  async function givenExistingOrder(id: string, customerId: string, storeId: string, items: OrderItem[] = []): Promise<void> {
    const orderRepository = app.getContainer().get<OrderRepository>('orderRepository')

    await orderRepository.save(new Order({ id: new UuidV1(id), customerId: new UuidV1(customerId), storeId: new UuidV1(storeId), items }))
  }

  test('When valid request returns 200 status code', async () => {
    // Given
    const orderId = UuidV1.create().value
    const route = givenRoute()
    await givenExistingStore(CreateDemo.FIXTURES.store.id, 'store-name', CreateDemo.FIXTURES.seller.id)
    await givenExistingCategory(CreateDemo.FIXTURES.categories[0].id, 'category-name')
    await givenExistingProduct(CreateDemo.FIXTURES.products[0].id, CreateDemo.FIXTURES.categories[0].id, CreateDemo.FIXTURES.store.id)
    await givenExistingOrder(orderId, CreateDemo.FIXTURES.customer.id, CreateDemo.FIXTURES.store.id, [new OrderItem({ productId: new UuidV1(CreateDemo.FIXTURES.products[0].id), quantity: 4 })])

    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedStatusCode = 200
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
