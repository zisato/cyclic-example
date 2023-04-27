import { Request, Response } from 'express'
import CreateProduct from '../../../../../src/application/product/create/create-product'
import CreateProductController from '../../../../../src/infrastructure/product/controller/admin/create-product-controller'
import { InvalidJsonSchemaError } from '../../../../../src/infrastructure/error/invalid-json-schema-error'
import FindStoreBySellerId from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id'
import { Store } from '../../../../../src/domain/store/store'
import ListCategories from '../../../../../src/application/category/list/list-categories'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'
// import { ListCategoriesQuery } from '../../../../../src/application/category/list/list-categories-query'
// import { Category } from '../../../../../src/domain/category/category'
import { FindStoreBySellerIdQuery } from '../../../../../src/application/store/find-by-seller-id/find-store-by-seller-id-query'
import CreateDemo from '../../../../../src/application/demo/create/create-demo'
import { ListCategoriesQuery } from '../../../../../src/application/category/list/list-categories-query'
import { Category } from '../../../../../src/domain/category/category'
import { Identity } from '../../../../../src/domain/identity/identity'
// import { ClassMock } from '../../../../helpers/interface-mock'

describe('CreateProductController unit test', () => {

  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    findStoreBySellerId: Partial<FindStoreBySellerId>,
    createProduct: Partial<CreateProduct>,
    listCategories: Partial<ListCategories>
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
    createProduct: {
      execute: jest.fn()
    },
    listCategories: {
      execute: jest.fn()
    }
  }
  const controller = new CreateProductController(stubs.findStoreBySellerId as FindStoreBySellerId, stubs.createProduct as CreateProduct, stubs.listCategories as ListCategories)

  function getValidRequestBody(name: string, categoryId: string): any {
    return {
      attributes: {
        name: name
      },
      relationships: {
        category: {
          id: categoryId
        }
      }
    }
  }

  function givenAStore(storeId: Identity, sellerId: Identity): Store {
    const storeName = 'StoreName'

    return new Store({ id: storeId, name: storeName, sellerId: sellerId })
  }

  /*
  test('Should throw Error when not user property in auth request', async () => {
    const request = {} as Partial<AuthRequest>

    const result = controller.handle(request as AuthRequest, stubs.response as Response)

    const expectedError = Error('Not authenticated user')
    void expect(result).rejects.toThrow(expectedError)
  })
  */

  describe('GET method', () => {
    test('Should call listCategories.execute method when valid request body', async () => {
      // Given
      const sellerId = CreateDemo.FIXTURES.seller.id
      const name = 'product-name'
      const categoryId = UuidV1.create().value
      const categories: Category[] = []
      stubs.request.user = { id: sellerId }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name, categoryId)
      stubs.listCategories.execute = jest.fn().mockResolvedValueOnce(categories)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = new ListCategoriesQuery()
      expect(stubs.listCategories.execute).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.listCategories.execute).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call res.status method when valid request body', async () => {
      // Given
      const sellerId = CreateDemo.FIXTURES.seller.id
      const name = 'product-name'
      const categoryId = UuidV1.create().value
      const categories: Category[] = []
      stubs.request.user = { id: sellerId }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name, categoryId)
      stubs.listCategories.execute = jest.fn().mockResolvedValueOnce(categories)

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
      const sellerId = CreateDemo.FIXTURES.seller.id
      const name = 'product-name'
      const categoryId = UuidV1.create()
      const categories: Category[] = [
        new Category({ id: categoryId, name: 'category-name' })
      ]
      stubs.request.user = { id: sellerId }
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name, categoryId.value)
      stubs.listCategories.execute = jest.fn().mockResolvedValueOnce(categories)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = ['admin/product/create', {
        categories: [{
          id: categoryId.value,
          attributes: {
            name: 'category-name'
          }
        }]
      }]
      expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
    })
  })

  describe('POST method', () => {
    test('Should call findStoreBySellerId.execute method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'product-name'
      const categoryId = UuidV1.create().value
      const storeId = UuidV1.create()
      const store = givenAStore(storeId, sellerId)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name, categoryId)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expected = new FindStoreBySellerIdQuery(sellerId.value)
      expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledTimes(1)
      expect(stubs.findStoreBySellerId.execute).toHaveBeenCalledWith(expected)
    })

    test('Should call createProduct.execute method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'product-name'
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const store = givenAStore(storeId, sellerId)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name, categoryId.value)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expected = {
        name: 'product-name',
        categoryId: categoryId,
        storeId: storeId
      }
      expect(stubs.createProduct.execute).toHaveBeenCalledTimes(1)
      expect(stubs.createProduct.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
    })

    test('Should call res.redirect method when valid request body', async () => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const name = 'product-name'
      const categoryId = UuidV1.create().value
      const storeId = UuidV1.create()
      const store = givenAStore(storeId, sellerId)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)
      stubs.request.user = { id: sellerId.value }
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name, categoryId)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = '/admin/products'
      expect(stubs.response.redirect).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.redirect).toHaveBeenCalledWith(expectedArguments)
    })

    test.each([
      { // missing attributes
        relationships: {
          category: {
            id: 'fd8b5e78-cb58-11ed-afa1-0242ac120002'
          }
        }
      },
      { // missing attributes.name
        attributes: {},
        relationships: {
          category: {
            id: 'fd8b5e78-cb58-11ed-afa1-0242ac120002'
          }
        }
      },
      { // missing relationships
        attributes: {
          name: 'product-name'
        }
      },
      { // missing relationships.category
        attributes: {
          name: 'product-name'
        },
        relationships: {}
      },
      { // missing relationships.category.id
        attributes: {
          name: 'product-name'
        },
        relationships: {
          category: {}
        }
      }
    ])('Should throw Error when missing request body parameters %j', async (requestBody) => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const storeId = UuidV1.create()
      const store = givenAStore(storeId, sellerId)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)
      stubs.request.user = { id: sellerId.value }
      stubs.request.body = requestBody
      stubs.request.method = 'POST'

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
        },
        relationships: {
          category: {
            id: 'fd8b5e78-cb58-11ed-afa1-0242ac120002'
          }
        }
      },
      {
        attributes: {
          name: false
        },
        relationships: {
          category: {
            id: 'fd8b5e78-cb58-11ed-afa1-0242ac120002'
          }
        }
      },
      {
        attributes: {
          name: null
        },
        relationships: {
          category: {
            id: 'fd8b5e78-cb58-11ed-afa1-0242ac120002'
          }
        }
      },
      // invalid category id
      {
        attributes: {
          name: 'product-name'
        },
        relationships: {
          category: {
            id: 123
          }
        }
      },
      {
        attributes: {
          name: 'product-name'
        },
        relationships: {
          category: {
            id: false
          }
        }
      },
      {
        attributes: {
          name: 'product-name'
        },
        relationships: {
          category: {
            id: null
          }
        }
      }
    ])('Should throw Error when invalid request body parameters %j', async (requestBody) => {
      // Given
      const sellerId = new UuidV1(CreateDemo.FIXTURES.seller.id)
      const storeId = UuidV1.create()
      const store = givenAStore(storeId, sellerId)
      stubs.findStoreBySellerId.execute = jest.fn().mockResolvedValueOnce(store)
      stubs.request.user = { id: sellerId.value }
      stubs.request.body = requestBody
      stubs.request.method = 'POST'

      // When
      const result = controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })
  })
})
