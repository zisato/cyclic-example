import { Request, Response } from 'express'
import CreateProduct from '../../../../src/application/product/create/create-product'
import CreateProductController from '../../../../src/infrastructure/product/controller/create-product-controller'
import { InvalidJsonSchemaError } from '../../../../src/infrastructure/error/invalid-json-schema-error'

describe('CreateProductController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    createProduct: Partial<CreateProduct>
  } = {
    request: {
      body: jest.fn()
    },
    response: {
      status: jest.fn().mockImplementation(() => {
        return stubs.response
      }),
      send: jest.fn()
    },
    createProduct: {
      execute: jest.fn()
    }
  }
  const controller = new CreateProductController(stubs.createProduct as CreateProduct)

  function getValidRequestBody (id: string, name: string): any {
    return {
      data: {
        id: id,
        attributes: {
          name: name
        }
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Should call createProduct.execute method when valid request body', async () => {
    // Given
    const id = '1a3e9968-bba5-11ed-afa1-0242ac120002'
    const name = 'product-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {
      id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
      name: 'product-name'
    }
    expect(stubs.createProduct.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createProduct.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call res.send method when valid request body', async () => {
    // Given
    const id = '1a3e9968-bba5-11ed-afa1-0242ac120002'
    const name = 'product-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.send).toHaveBeenCalledTimes(1)
  })

  test.each([
    {
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {
            name: 'product-name'
        }
      }
    }
  ])('Should return 201 when valid request body %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.status).toHaveBeenCalledTimes(1)
    expect(stubs.response.status).toHaveBeenCalledWith(201)
  })

  test.each([
    { // missing data

    },
    { // missing data.id
      data: {
        attributes: {
          name: 'product-name'
        }
      }
    },
    { // missing data.attributes
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
      }
    },
    { // missing data.attributes.name
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {}
      }
    }
  ])('Should throw Error when missing request body parameters %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    const result = controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    void expect(result).rejects.toThrow(InvalidJsonSchemaError)
  })

  test.each([
    // invalid id
    {
      data: {
        id: 123,
        attributes: {
          name: 'product-name'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          name: 'product-name'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          name: 'product-name'
        }
      }
    },
    // invalid name
    {
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {
          name: 123
        }
      }
    },
    {
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {
            name: false
        }
      }
    },
    {
      data: {
        id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
        attributes: {
            name: null
        }
      }
    }
  ])('Should throw Error when invalid request body parameters %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    const result = controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    void expect(result).rejects.toThrow(InvalidJsonSchemaError)
  })
})
