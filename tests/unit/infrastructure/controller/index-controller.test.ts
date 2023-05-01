import { Request, Response } from 'express'
import IndexController from '../../../../src/infrastructure/controller/index-controller'
import ListStore from '../../../../src/application/store/list/list-store'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { Store } from '../../../../src/domain/store/store'

describe('IndexController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listStore: Partial<ListStore>
  } = {
    request: {
      body: jest.fn()
    },
    response: {
      render: jest.fn()
    },
    listStore: {
      execute: jest.fn()
    }
  }
  const controller = new IndexController(stubs.listStore as ListStore)

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

  test('Should call res.redirect method when valid request', async () => {
    // Given
    const storeId = UuidV1.create()
    const storeName = 'store-name'
    const storeSellerId = UuidV1.create()
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
