import { Request, Response } from 'express'
import ListProducts from '../../../../../src/application/product/list/list-products'
import { ListProductsQuery } from '../../../../../src/application/product/list/list-products-query'
import ListProductsController from '../../../../../src/infrastructure/product/controller/list-products-controller'
import { Product } from '../../../../../src/domain/product/product'
import FindStoreById from '../../../../../src/application/store/find-by-id/find-store-by-id'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { Store } from '../../../../../src/domain/store/store'
import { FindStoreByIdQuery } from '../../../../../src/application/store/find-by-id/find-store-by-id-query'
import { Order } from '../../../../../src/domain/order/order'
import FindOrderByCustomerId from '../../../../../src/application/order/find-by-customer-id/find-order-by-customer-id'
import JsonApiProductDetailTransformer from '../../../../../src/infrastructure/product/transformer/json-api-product-detail-transformer'
import JsonApiStoreTransformer from '../../../../../src/infrastructure/store/transformer/json-api-store-transformer'
import JsonApiOrderTransformer from '../../../../../src/infrastructure/order/transformer/json-api-order-transformer'

describe('ListProductsController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listProducts: Partial<ListProducts>
    findStoreById: Partial<FindStoreById>
    findOrderByCustomerId: Partial<FindOrderByCustomerId>,
    jsonApiProductDetailTransformer: Partial<JsonApiProductDetailTransformer>,
    jsonApiStoreTransformer: Partial<JsonApiStoreTransformer>,
    jsonApiOrderTransformer: Partial<JsonApiOrderTransformer>
  } = {
    request: {
      params: {},
      user: {}
    },
    response: {
      render: jest.fn().mockImplementation(() => {
        return stubs.response
      }),
      redirect: jest.fn().mockImplementation(() => {
        return stubs.response
      }),
      status: jest.fn().mockImplementation(() => {
        return stubs.response
      })
    },
    listProducts: {
      execute: jest.fn()
    },
    findStoreById: {
      execute: jest.fn()
    },
    findOrderByCustomerId: {
      execute: jest.fn()
    },
    jsonApiProductDetailTransformer: {
      transformArray: jest.fn()
    },
    jsonApiStoreTransformer: {
      transform: jest.fn()
    },
    jsonApiOrderTransformer: {
      transform: jest.fn()
    }
  }

  const controller = new ListProductsController(
    stubs.listProducts as ListProducts,
    stubs.findStoreById as FindStoreById,
    stubs.findOrderByCustomerId as FindOrderByCustomerId,
    stubs.jsonApiProductDetailTransformer as JsonApiProductDetailTransformer,
    stubs.jsonApiStoreTransformer as JsonApiStoreTransformer,
    stubs.jsonApiOrderTransformer as JsonApiOrderTransformer
  )

  test('Should call findStoreById.execute method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new FindStoreByIdQuery(storeId.value)
    expect(stubs.findStoreById.execute).toHaveBeenCalledTimes(1)
    expect(stubs.findStoreById.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call listProducts.execute method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new ListProductsQuery(storeId.value)
    expect(stubs.listProducts.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listProducts.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiStoreTransformer.transform method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const sellerId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {
      id: storeId,
      name: 'store-name',
      sellerId
    }
    expect(stubs.jsonApiStoreTransformer.transform).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiStoreTransformer.transform).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiProductDetailTransformer.transformArray method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    const product1Id = UuidV1.create()
    const product2Id = UuidV1.create()
    const categoryId = UuidV1.create()
    const products = [
      new Product({ id: product1Id, name: 'product-1-name', categoryId, storeId }),
      new Product({ id: product2Id, name: 'product-2-name', categoryId, storeId })
    ]
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue(products)
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expected = [
      {
        id: product1Id,
        name: 'product-1-name',
        categoryId,
        storeId,
        imageFilename: null
      },
      {
        id: product2Id,
        name: 'product-2-name',
        categoryId,
        storeId,
        imageFilename: null
      },
    ]
    expect(stubs.jsonApiProductDetailTransformer.transformArray).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.jsonApiProductDetailTransformer.transformArray).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiOrderTransformer.transform method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    const orderDetail = {
      id: order.id,
      items: []
    }
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(orderDetail)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {
      id: order.id,
      items: []
    }
    expect(stubs.jsonApiOrderTransformer.transform).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiOrderTransformer.transform).toHaveBeenCalledWith(expected)
  })

  test('Should call res.status method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = 200
    expect(stubs.response.status).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.status).toHaveBeenCalledWith(expectedArguments)
  })

  test('Should call res.render method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const productId = UuidV1.create()
    const categoryId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const products = [
      new Product({ id: productId, name: 'product-name', categoryId: categoryId, storeId: storeId, imageFilename: null })
    ]
    const orderId = UuidV1.create()
    const customerId = UuidV1.create()
    const order = new Order({ id: orderId, customerId, storeId })
    const storeJsonApi = {
      id: storeId.value,
      attributes: {
        name: 'store-name'
      }
    }
    const productsJsonApi = [
      {
        id: productId.value,
        attributes: {
          name: 'product-name',
          image: null
        }
      }
    ]
    const orderJsonApi = {
      id: orderId.value,
      attributes: {
        items: []
      }
    }
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue(products)
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)
    stubs.jsonApiStoreTransformer.transform = jest.fn().mockReturnValueOnce(storeJsonApi)
    stubs.jsonApiProductDetailTransformer.transformArray = jest.fn().mockReturnValueOnce(productsJsonApi)
    stubs.jsonApiOrderTransformer.transform = jest.fn().mockReturnValueOnce(orderJsonApi)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'product/list',
      {
        store: storeJsonApi,
        products: [
          {
            id: productId.value,
            attributes: {
              name: 'product-name',
              image: null
            }
          }
        ],
        order: {
          id: orderId.value,
          attributes: {
            items: []
          }
        }
      }
    ]
    expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
  })
})
