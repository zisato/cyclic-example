import { Request, Response } from 'express'
import ListProducts from '../../../../src/application/product/list/list-products'
import { ListProductsQuery } from '../../../../src/application/product/list/list-products-query'
import ListProductsController from '../../../../src/infrastructure/product/controller/list-products-controller'
import { Product } from '../../../../src/domain/product/product'
import FindStoreById from '../../../../src/application/store/find-by-id/find-store-by-id'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { Store } from '../../../../src/domain/store/store'
import { FindStoreByIdQuery } from '../../../../src/application/store/find-by-id/find-store-by-id-query'

describe('ListProductsController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listProducts: Partial<ListProducts>,
    findStoreById: Partial<FindStoreById>
  } = {
    request: {
      params: {}
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
    }
  }

  const controller = new ListProductsController(stubs.listProducts as ListProducts, stubs.findStoreById as FindStoreById)

  test('Should call findStoreById.execute method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create().value
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create().value })
    stubs.request.params = { storeId: storeId }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new FindStoreByIdQuery(storeId)
    expect(stubs.findStoreById.execute).toHaveBeenCalledTimes(1)
    expect(stubs.findStoreById.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call listProducts.execute method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create().value
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create().value })
    stubs.request.params = { storeId: storeId }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new ListProductsQuery(storeId)
    expect(stubs.listProducts.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listProducts.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call res.status method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create().value
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create().value })
    stubs.request.params = { storeId: storeId }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])

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
    const storeId = UuidV1.create().value
    const productId = UuidV1.create().value
    const categoryId = UuidV1.create().value
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create().value })
    const products = [
      new Product({ id: productId, name: 'product-name', categoryId: categoryId, storeId: storeId})
    ]
    stubs.request.params = { storeId: storeId }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue(products)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'product/list',
      {
        store: {
          id: storeId,
          attributes: {
            name: 'store-name'
          }
        },
        products: [
          {
            id: productId,
            attributes: {
                name: 'product-name'
            }
        }
        ]
      }
    ]
    expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
  })
})
