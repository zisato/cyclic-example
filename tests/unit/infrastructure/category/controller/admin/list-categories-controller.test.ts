import { Request, Response } from 'express'
import ListCategories from '../../../../../../src/application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../../../src/application/category/list/list-categories-query'
import ListCategoriesController from '../../../../../../src/infrastructure/category/controller/admin/list-categories-controller'
import { Category } from '../../../../../../src/domain/category/category'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import JsonApiCategoryTransformer from '../../../../../../src/infrastructure/category/transformer/json-api-category-transformer'

describe('ListCategoriesController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listCategories: Partial<ListCategories>
    jsonApiCategoryTransformer: Partial<JsonApiCategoryTransformer>
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
    listCategories: {
      execute: jest.fn()
    },
    jsonApiCategoryTransformer: {
      transformArray: jest.fn()
    }
  }
  const controller = new ListCategoriesController(stubs.listCategories as ListCategories, stubs.jsonApiCategoryTransformer as JsonApiCategoryTransformer)

  test('Should call listCategories.execute method when valid request body', async () => {
    // Given
    stubs.listCategories.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = new ListCategoriesQuery()
    expect(stubs.listCategories.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listCategories.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiCategoryTransformer.transformArray method when valid request', async () => {
    // Given
    const category1Id = UuidV1.create()
    const category2Id = UuidV1.create()
    const categories = [
      new Category({ id: category1Id, name: 'category-1-name' }),
      new Category({ id: category2Id, name: 'category-2-name' })
    ]
    stubs.listCategories.execute = jest.fn().mockResolvedValueOnce(categories)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = [
      {
        id: category1Id,
        name: 'category-1-name'
      },
      {
        id: category2Id,
        name: 'category-2-name'
      }
    ]
    expect(stubs.jsonApiCategoryTransformer.transformArray).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiCategoryTransformer.transformArray).toHaveBeenCalledWith(expected)
  })

  test('Should call res.status method when valid request body', async () => {
    // Given
    stubs.listCategories.execute = jest.fn().mockResolvedValue([])

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
    const categoryId = UuidV1.create()
    const categories = [
      new Category({ id: categoryId, name: 'category-name'})
    ]
    const jsonApiCategories = [
      {
        id: categoryId.value,
        attributes: {
          name: 'category-name'
        }
      }
    ]
    stubs.listCategories.execute = jest.fn().mockResolvedValue(categories)
    stubs.jsonApiCategoryTransformer.transformArray = jest.fn().mockReturnValueOnce(jsonApiCategories)

    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      'admin/category/list',
      {
        categories: [
          {
            id: categoryId.value,
            attributes: {
                name: 'category-name'
            }
        }
        ]
      }
    ]
    expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
  })
})
