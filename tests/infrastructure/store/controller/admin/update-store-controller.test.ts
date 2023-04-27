import { Request, Response } from 'express'
import UpdateStoreController from '../../../../../src/infrastructure/store/controller/admin/update-store-controller'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
import { InvalidJsonSchemaError } from '../../../../../src/infrastructure/error/invalid-json-schema-error'
import UpdateStore from '../../../../../src/application/store/update/update-store'
import FindStoreBySellerId from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id'
import { Store } from '../../../../../src/domain/store/store'
import CreateDemo from '../../../../../src/application/demo/create/create-demo'
import { FindStoreBySellerIdQuery } from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id-query'

describe('UpdateStoreController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    findStoreBySellerId: Partial<FindStoreBySellerId>,
    updateStore: Partial<UpdateStore>
  } = {
    request: {
      body: jest.fn(),
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
    findStoreBySellerId: {
      execute: jest.fn()
    },
    updateStore: {
      execute: jest.fn()
    }
  }

  const controller = new UpdateStoreController(stubs.findStoreBySellerId as FindStoreBySellerId, stubs.updateStore as UpdateStore)

  function getValidRequestBody(name: string): any {
    return {
      attributes: {
        name: name
      }
    }
  }

  describe('GET method', () => {
    test('Should call findStoreBySellerId.execute method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'new-store-name'
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = new FindStoreBySellerIdQuery(sellerId.value)
      expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call res.status method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'new-store-name'
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

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
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'new-store-name'
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = ['admin/store/update', {
        store: {
          id: storeId.value,
          attributes: {
            name: 'store-name'
          }
        }
      }]
      expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
    })
  })

  describe('POST method', () => {
    test('Should call updateStore.execute method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'new-store-name'
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expected = {
        id: storeId,
        name: 'new-store-name'
      }
      expect(stubs.updateStore.execute).toHaveBeenCalledTimes(1)
      expect(stubs.updateStore.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
    })

    test('Should call res.redirect method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'new-store-name'
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = '/admin/stores/update'
      expect(stubs.response.redirect).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.redirect).toHaveBeenCalledWith(expectedArguments)
    })

    test.each([
      { // missing attributes
      },
      { // missing attributes.name
        attributes: {}
      }
    ])('Should throw Error when missing request body parameters %j', async (requestBody) => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = requestBody
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      const result = controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })

    test.each([
      // invalid name
      {
        attributes: {
          name: 123
        }
      },
      {
        attributes: {
          name: false
        }
      },
      {
        attributes: {
          name: null
        }
      }
    ])('Should throw Error when invalid request body parameters %j', async (requestBody) => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const storeId = UuidV1.create()
      const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = requestBody
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)

      // When
      const result = controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })
  })
})
