import { Request, Response } from 'express'
import IndexController from '../../../../src/infrastructure/controller/index-controller'
import ListStore from '../../../../src/application/store/list/list-store'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { Store } from '../../../../src/domain/store/store'
import JsonApiStoreTransformer from '../../../../src/infrastructure/store/transformer/json-api-store-transformer'

describe('IndexController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listStore: Partial<ListStore>,
    jsonApiStoreTransformer: Partial<JsonApiStoreTransformer>
  } = {
    request: {
      body: jest.fn()
    },
    response: {
      render: jest.fn()
    },
    listStore: {
      execute: jest.fn()
    },
    jsonApiStoreTransformer: {
      transformArray: jest.fn()
    }
  }
  const controller = new IndexController(stubs.listStore as ListStore, stubs.jsonApiStoreTransformer as JsonApiStoreTransformer)

  test('Should call listStore.execute method when valid request', async () => {
    // Given
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {}
    expect(stubs.listStore.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listStore.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call jsonApiStoreTransformer.transformArray method when valid request', async () => {
    // Given
    const store1Id = UuidV1.create()
    const store2Id = UuidV1.create()
    const sellerId = UuidV1.create()
    const stores = [
      new Store({ id: store1Id, name: 'store-1-name', sellerId }),
      new Store({ id: store2Id, name: 'store-2-name', sellerId })
    ]
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce(stores)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = [
      {
        id: store1Id,
        name: 'store-1-name',
        sellerId: sellerId
      },
      {
        id: store2Id,
        name: 'store-2-name',
        sellerId: sellerId
      }
    ]
    expect(stubs.jsonApiStoreTransformer.transformArray).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiStoreTransformer.transformArray).toHaveBeenCalledWith(expected)
  })

  test('Should call res.render method when valid request', async () => {
    // Given
    const storeId = UuidV1.create()
    const storeName = 'store-name'
    const storeSellerId = UuidV1.create()
    const stores = [
      new Store({ id: storeId, name: storeName, sellerId: storeSellerId })
    ]
    const jsonApiStores = [
      {
        id: storeId.value,
        attributes: {
          name: 'store-name'
        }
      }
    ]
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce(stores)
    stubs.jsonApiStoreTransformer.transformArray = jest.fn().mockReturnValueOnce(jsonApiStores)

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
        ]
      }
    ]
    expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
  })
})
