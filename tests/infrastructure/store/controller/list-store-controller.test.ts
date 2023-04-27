import { Request, Response } from 'express'
import ListStore from '../../../../src/application/store/list/list-store'
import { Store } from '../../../../src/domain/store/store'
import ListStoreController from '../../../../src/infrastructure/store/controller/list-store-controller'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'

describe('ListStoreController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listStore: Partial<ListStore>
  } = {
    request: {
      body: jest.fn()
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
    }
  }
  const controller = new ListStoreController(stubs.listStore as ListStore)

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

  test('Should return 200 when valid request', async () => {
    // Given
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.status).toHaveBeenCalledTimes(1)
    expect(stubs.response.status).toHaveBeenCalledWith(200)
  })

  test('Should return JsonApi body when valid request', async () => {
    // Given
    const storeId = UuidV1.create().value
    const storeName = 'store-name'
    const storeSellerId = UuidV1.create().value
    const stores = [
      new Store({ id: storeId, name: storeName, sellerId: storeSellerId })
    ]
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce(stores)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'store/list',
      {
        stores: [
          {
            id: storeId,
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
