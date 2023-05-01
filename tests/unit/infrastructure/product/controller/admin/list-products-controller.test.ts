import { Request, Response } from 'express'
import ListProducts from '../../../../../../src/application/product/list/list-products'
import { ListProductsQuery } from '../../../../../../src/application/product/list/list-products-query'
import ListProductsController from '../../../../../../src/infrastructure/product/controller/admin/list-products-controller'
import { Product } from '../../../../../../src/domain/product/product'
import FindStoreBySellerId from '../../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import { FindStoreBySellerIdQuery } from '../../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id-query'
import CreateDemo from '../../../../../../src/application/demo/create/create-demo'
import { Store } from '../../../../../../src/domain/store/store'
import { Image } from '../../../../../../src/domain/product/image'

describe('ListProductsController unit test', () => {
  const testPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listProducts: Partial<ListProducts>,
    findStoreBySellerId: Partial<FindStoreBySellerId>
  } = {
    request: {
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
    findStoreBySellerId: {
      execute: jest.fn()
    }
  }

  const controller = new ListProductsController(stubs.listProducts as ListProducts, stubs.findStoreBySellerId as FindStoreBySellerId)

  test('Should call findStoreBySellerId.execute method when valid request body', async () => {
    // Given
    const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
    const store = new Store({ id: UuidV1.create(), name: 'store-name', sellerId: sellerId })
    stubs.request.user = { id: sellerId.value }
    stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new FindStoreBySellerIdQuery(sellerId.value)
    expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledTimes(1)
    expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call listProducts.execute method when valid request body', async () => {
    // Given
    const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
    const storeId = new UuidV1(CreateDemo.FIXTURES.seller.id)
    const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
    stubs.request.user = { id: sellerId.value }
    stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new ListProductsQuery(storeId.value)
    expect(stubs.listProducts.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listProducts.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call res.status method when valid request body', async () => {
    // Given
    const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
    const store = new Store({ id: UuidV1.create(), name: 'store-name', sellerId: sellerId })
    stubs.request.user = { id: sellerId.value }
    stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValue(store)
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
    const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
    const product1Id = UuidV1.create()
    const product2Id = UuidV1.create()
    const categoryId = UuidV1.create()
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: sellerId })
    const image = new Image({ name: 'test', mimeType: 'image/png', size: 0, data: Buffer.from(testPng, 'base64') })
    const products = [
      new Product({ id: product1Id, name: 'product-1-name', categoryId: categoryId, storeId: storeId, image: null }),
      new Product({ id: product2Id, name: 'product-2-name', categoryId: categoryId, storeId: storeId, image: image })
    ]
    stubs.request.user = { id: sellerId.value }
    stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue(products)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'admin/product/list',
      {
        store: {
          id: storeId.value,
          attributes: {
            name: 'store-name'
          }
        },
        products: [
          {
            id: product1Id.value,
            attributes: {
              name: 'product-1-name',
              image: null
            }
          },
          {
            id: product2Id.value,
            attributes: {
              name: 'product-2-name',
              image: `data:image/png;base64, ${testPng}`
            }
          }
        ]
      }
    ]
    expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
  })
})
