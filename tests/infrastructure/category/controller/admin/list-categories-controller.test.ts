import { Request, Response } from 'express'
import ListCategories from '../../../../../src/application/category/list/list-categories'
import { ListCategoriesQuery } from '../../../../../src/application/category/list/list-categories-query'
import ListCategoriesController from '../../../../../src/infrastructure/category/controller/admin/list-categories-controller'
import { Category } from '../../../../../src/domain/category/category'
import { UuidV1 } from '../../../../../src/infrastructure/identity/uuid-v1'

describe('ListCategoriesController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    listCategories: Partial<ListCategories>
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
    }
  }
  const controller = new ListCategoriesController(stubs.listCategories as ListCategories)

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
    stubs.listCategories.execute = jest.fn().mockResolvedValue(categories)

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
