import { Request, Response } from 'express'
import CreateCategory from '../../../../../src/application/category/create/create-category'
import CreateCategoryController from '../../../../../src/infrastructure/category/controller/admin/create-category-controller'
import { InvalidJsonSchemaError } from '../../../../../src/infrastructure/error/invalid-json-schema-error'

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
    createCategory: {
      execute: jest.fn()
    }
  }
  const controller = new CreateCategoryController(stubs.createCategory as CreateCategory)

  function getValidRequestBody (name: string): any {
    return {
      attributes: {
        name: name
      }
    }
  }

  describe('GET method', () => {
    test('Should call res.status method when valid request body', async () => {
      // Given
      const name = 'category-name'
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name)
  
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
      const name = 'category-name'
      stubs.request.method = 'GET'
      stubs.request.body = getValidRequestBody(name)
  
      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)
  
      // Then
      const expectedTimes = 1
      const expectedArguments = 'admin/category/create'
      expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.render).toHaveBeenCalledWith(expectedArguments)
    })
  })
  
  describe('POST method', () => {
    test('Should call createCategory.execute method when valid request body', async () => {
      // Given
      const name = 'category-name'
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name)
  
      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)
  
      // Then
      const expected = {
        name: 'category-name'
      }
      expect(stubs.createCategory.execute).toHaveBeenCalledTimes(1)
      expect(stubs.createCategory.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
    })

    test('Should call response.redirect method when valid request body', async () => {
      // Given
      const name = 'category-name'
      stubs.request.method = 'POST'
      stubs.request.body = getValidRequestBody(name)
  
      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)
  
      // Then
      const expected = '/admin/categories'
      expect(stubs.response.redirect).toHaveBeenCalledTimes(1)
      expect(stubs.response.redirect).toHaveBeenCalledWith(expected)
    })
  
    test.each([
      { // missing attributes
      },
      { // missing attributes.name
        attributes: {}
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
      stubs.request.body = requestBody
  
      // When
      const result = controller.handle(stubs.request as Request, stubs.response as Response)
  
      // Then
      void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })
  })
})
