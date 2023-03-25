import { Request, Response } from 'express'
import CreateCategory from '../../../../src/application/category/create/create-category'
import CreateCategoryController from '../../../../src/infrastructure/category/controller/create-category-controller'
import { InvalidJsonSchemaError } from '../../../../src/infrastructure/error/invalid-json-schema-error'

describe('CreateCategoryController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    createCategory: Partial<CreateCategory>
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
    createCategory: {
      execute: jest.fn()
    }
  }
  const controller = new CreateCategoryController(stubs.createCategory as CreateCategory)

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

  test('Should call createCategory.execute method when valid request body', async () => {
    // Given
    const id = '1a3e9968-bba5-11ed-afa1-0242ac120002'
    const name = 'category-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {
      id: '1a3e9968-bba5-11ed-afa1-0242ac120002',
      name: 'category-name'
    }
    expect(stubs.createCategory.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createCategory.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call res.send method when valid request body', async () => {
    // Given
    const id = '1a3e9968-bba5-11ed-afa1-0242ac120002'
    const name = 'category-name'
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
            name: 'category-name'
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
          name: 'category-name'
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
          name: 'category-name'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          name: 'category-name'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          name: 'category-name'
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
