import { Request, Response } from 'express'
import ListStore from '../../../../src/application/store/list/list-store'
import { Store } from '../../../../src/domain/store/store'
import ListStoreController from '../../../../src/infrastructure/store/controller/list-store-controller'

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
      json: jest.fn()
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

  test('Should call res.json method when valid request', async () => {
    // Given
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.json).toHaveBeenCalledTimes(1)
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
    const stores = [
      new Store('store-id', 'store-name', 'user-id')
    ]
    stubs.listStore.execute = jest.fn().mockResolvedValueOnce(stores)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedResponseBody = {
      data: [
        {
          id: 'store-id',
          attributes: {
            name: 'store-name'
          }
        }
      ]
    }
    expect(stubs.response.json).toHaveBeenCalledWith(expectedResponseBody)
  })
})
