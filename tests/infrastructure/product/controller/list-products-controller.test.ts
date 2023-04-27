import { Request, Response } from 'express'
import ListProducts from '../../../../src/application/product/list/list-products'
import { ListProductsQuery } from '../../../../src/application/product/list/list-products-query'
import ListProductsController from '../../../../src/infrastructure/product/controller/list-products-controller'
import { Product } from '../../../../src/domain/product/product'
import FindStoreById from '../../../../src/application/store/find-by-id/find-store-by-id'
import { UuidV1 } from '../../../../src/infrastructure/identity/uuid-v1'
import { Store } from '../../../../src/domain/store/store'
import { FindStoreByIdQuery } from '../../../../src/application/store/find-by-id/find-store-by-id-query'
import CustomerOrderDetail from '../../../../src/application/order/detail/customer-order-detail'
import { Order } from '../../../../src/domain/order/order'

describe('ListProductsController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listProducts: Partial<ListProducts>
    findStoreById: Partial<FindStoreById>
    customerOrderDetail: Partial<CustomerOrderDetail>
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
    customerOrderDetail: {
      execute: jest.fn()
    }
  }

  const controller = new ListProductsController(stubs.listProducts as ListProducts, stubs.findStoreById as FindStoreById, stubs.customerOrderDetail as CustomerOrderDetail)

  test('Should call findStoreById.execute method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.customerOrderDetail.execute = jest.fn().mockResolvedValueOnce(order)

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
    const order = new Order({ id: UuidV1.create(), customerId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.customerOrderDetail.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new ListProductsQuery(storeId.value)
    expect(stubs.listProducts.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listProducts.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call res.status method when valid request body', async () => {
    // Given
    const storeId = UuidV1.create()
    const store = new Store({ id: storeId, name: 'store-name', sellerId: UuidV1.create() })
    const customerId = UuidV1.create()
    const order = new Order({ id: UuidV1.create(), customerId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue([])
    stubs.customerOrderDetail.execute = jest.fn().mockResolvedValueOnce(order)

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
      new Product({ id: productId, name: 'product-name', categoryId: categoryId, storeId: storeId})
    ]
    const orderId = UuidV1.create()
    const customerId = UuidV1.create()
    const order = new Order({ id: orderId, customerId })
    stubs.request.user = { id: customerId.value }
    stubs.request.params = { storeId: storeId.value }
    stubs.findStoreById.execute = jest.fn().mockResolvedValue(store)
    stubs.listProducts.execute = jest.fn().mockResolvedValue(products)
    stubs.customerOrderDetail.execute = jest.fn().mockResolvedValueOnce(order)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'product/list',
      {
        store: {
          id: storeId.value,
          attributes: {
            name: 'store-name'
          }
        },
        products: [
          {
            id: productId.value,
            attributes: {
                name: 'product-name'
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
