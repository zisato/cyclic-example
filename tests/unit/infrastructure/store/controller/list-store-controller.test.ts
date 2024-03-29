import { Request, Response } from 'express'
import ListStore from '../../../../../src/application/store/list/list-store'
import { Store } from '../../../../../src/domain/store/store'
import ListStoreController from '../../../../../src/infrastructure/store/controller/list-store-controller'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { Order } from '../../../../../src/domain/order/order'
import FindOrderByCustomerId from '../../../../../src/application/order/find-by-customer-id/find-order-by-customer-id'
import JsonApiStoreTransformer from '../../../../../src/infrastructure/store/transformer/json-api-store-transformer'
import JsonApiOrderTransformer from '../../../../../src/infrastructure/order/transformer/json-api-order-transformer'

describe('ListStoreController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listStore: Partial<ListStore>
    findOrderByCustomerId: Partial<FindOrderByCustomerId>,
    jsonApiStoreTransformer: Partial<JsonApiStoreTransformer>,
    jsonApiOrderTransformer: Partial<JsonApiOrderTransformer>
  } = {
    request: {
      body: jest.fn(),
      user: {}
    },
    response: {
      status: jest.fn().mockImplementation(() => {
        return stubs.response
      }),
      render: jest.fn().mockImplementation(() => {
        return stubs.response
      })
    },
    listStore: {
      execute: jest.fn()
    },
    findOrderByCustomerId: {
      execute: jest.fn()
    },
    jsonApiStoreTransformer: {
      transformArray: jest.fn()
    },
    jsonApiOrderTransformer: {
      transform: jest.fn()
    }
  }
  const controller = new ListStoreController(
    stubs.listStore as ListStore,
    stubs.findOrderByCustomerId as FindOrderByCustomerId,
    stubs.jsonApiStoreTransformer as JsonApiStoreTransformer,
    stubs.jsonApiOrderTransformer as JsonApiOrderTransformer
  )

  test('Should call listStore.execute method when valid request', async () => {
    // Given
    const storeId = UuidV1.create()
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {}
    expect(stubs.listStore.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listStore.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should return 200 when valid request', async () => {
    // Given
    const storeId = UuidV1.create()
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId, storeId })
    stubs.request.user = { id: customerId.value }
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce([])
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.status).toHaveBeenCalledTimes(1)
    expect(stubs.response.status).toHaveBeenCalledWith(200)
  })

  test('Should return JsonApi body when valid request', async () => {
    // Given
    const storeId = UuidV1.create()
    const customerId = UuidV1.create()
    const orderId = UuidV1.create()
    const order = new Order({ id: orderId, customerId, storeId })
    const storeName = 'store-name'
    const storeSellerId = UuidV1.create()
    const stores = [
      new Store({ id: storeId, name: storeName, sellerId: storeSellerId })
    ]
    const jsonApiStores = [
      {
        id: storeId.value,
        attributes: {
          name: storeName
        }
      }
    ]
    const jsonApiOrderDetail = {
      id: order.id.value,
      attributes: {
        items: []
      }
    }
    stubs.request.user = { id: customerId.value }
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce(stores)
    stubs.findOrderByCustomerId.execute = jest.fn().mockResolvedValueOnce(order)
    stubs.jsonApiStoreTransformer.transformArray = jest.fn().mockReturnValueOnce(jsonApiStores)
    stubs.jsonApiOrderTransformer.transform = jest.fn().mockReturnValueOnce(jsonApiOrderDetail)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'store/list',
      {
        stores: [
          {
            id: storeId.value,
            attributes: {
              name: 'store-name'
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
