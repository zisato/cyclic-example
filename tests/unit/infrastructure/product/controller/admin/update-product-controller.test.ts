import { Request, Response } from 'express'
import UpdateProductController from '../../../../../../src/infrastructure/product/controller/admin/update-product-controller'
import { Product } from '../../../../../../src/domain/product/product'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import FindProductById from '../../../../../../src/application/product/find-by-id/find-product-by-id'
import UpdateProduct from '../../../../../../src/application/product/update/update-product'
import { FindProductByIdQuery } from '../../../../../../src/application/product/find-by-id/find-product-by-id-query'
// import { InvalidJsonSchemaError } from '../../../../../../src/infrastructure/error/invalid-json-schema-error'
// import { Image } from '../../../../../../src/domain/product/image'
import { UploadedFile } from 'express-fileupload'
import { onePixelTransparentPng } from '../../../../../helpers/image-mock'
import { FileStorageService } from '../../../../../../src/infrastructure/file-storage/file-storage-service'
import JsonApiProductDetailTransformer from '../../../../../../src/infrastructure/product/transformer/json-api-product-detail-transformer'

describe('UpdateProductController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    findProductById: Partial<FindProductById>,
    updateProduct: Partial<UpdateProduct>,
    fileStorageService: Partial<FileStorageService>,
    jsonApiProductDetailTransformer: Partial<JsonApiProductDetailTransformer>
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
    findProductById: {
      execute: jest.fn()
    },
    updateProduct: {
      execute: jest.fn()
    },
    fileStorageService: {
      put: jest.fn()
    },
    jsonApiProductDetailTransformer: {
      transform: jest.fn()
    }
  }

  const controller = new UpdateProductController(
    stubs.findProductById as FindProductById,
    stubs.updateProduct as UpdateProduct,
    stubs.fileStorageService as FileStorageService,
    stubs.jsonApiProductDetailTransformer as JsonApiProductDetailTransformer
  )

  function getValidRequestBody(name: string): any {
    return {
      attributes: {
        name: name
      }
    }
  }

  describe('GET method', () => {
    test('Should call findProductById.execute method when valid request body', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename: null })
      stubs.request.method = 'GET'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = new FindProductByIdQuery(productId.value)
      expect(stubs.findProductById.execute).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.findProductById.execute).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call res.status method when valid request body', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename: null })
      stubs.request.method = 'GET'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

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
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename: null })
      const jsonApiProduct = {
        id: product.id.value,
        attributes: {
            name: product.name,
            image: null
        }
      }
      stubs.request.method = 'GET'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)
      stubs.jsonApiProductDetailTransformer.transform = jest.fn().mockReturnValueOnce(jsonApiProduct)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = ['admin/product/update', {
        product: {
          id: productId.value,
          attributes: {
            name: 'product-name',
            image: null
          }
        }
      }]
      expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
    })

    test('Should call res.render method when valid request body having product with image', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename: 'test' })
      const jsonApiProduct = {
        id: product.id.value,
        attributes: {
            name: product.name,
            image: 'test'
        }
      }
      stubs.request.method = 'GET'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)
      stubs.jsonApiProductDetailTransformer.transform = jest.fn().mockReturnValueOnce(jsonApiProduct)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = [`admin/product/update`, {
        product: {
          id: productId.value,
          attributes: {
            name: 'product-name',
            image: 'test'
          }
        }
      }]
      expect(stubs.response.render).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.render).toHaveBeenCalledWith(...expectedArguments)
    })
  })

  describe('POST method', () => {
    test('Should call updateProduct.execute method when valid request body', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename: null })
      stubs.request.method = 'POST'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expected = {
        id: productId,
        name: 'new-product-name'
      }
      expect(stubs.updateProduct.execute).toHaveBeenCalledTimes(1)
      expect(stubs.updateProduct.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
    })

    test('Should call updateProduct.execute method when valid request body having product with image', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const imageFilename = 'test'
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId, imageFilename })
      stubs.request.method = 'POST'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.request.files = {
        attributes: {
          image: {
            name: 'test',
            mimetype: 'image/png',
            size: 0,
            data: Buffer.from(onePixelTransparentPng, 'base64')
          } 
        } as unknown as UploadedFile
      }
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)
      stubs.fileStorageService.put = jest.fn().mockReturnValueOnce('test')

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expected = {
        id: productId,
        name: 'new-product-name',
        image: 'test'
      }
      expect(stubs.updateProduct.execute).toHaveBeenCalledTimes(1)
      expect(stubs.updateProduct.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
    })

    test('Should call res.redirect method when valid request body', async () => {
      // Given
      const name = 'new-product-name'
      const productId = UuidV1.create()
      const categoryId = UuidV1.create()
      const storeId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId, storeId })
      stubs.request.method = 'POST'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = getValidRequestBody(name)
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

      // When
      await controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      const expectedTimes = 1
      const expectedArguments = `/admin/products/${product.id.value}/update`
      expect(stubs.response.redirect).toHaveBeenCalledTimes(expectedTimes)
      expect(stubs.response.redirect).toHaveBeenCalledWith(expectedArguments)
    })
    /*
    test.each([
      { // missing attributes
      },
      { // missing attributes.name
        attributes: {}
      }
    ])('Should throw Error when missing request body parameters %j', async (requestBody) => {
      // Given
      const productId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId: UuidV1.create(), storeId: UuidV1.create() })
      stubs.request.method = 'POST'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = requestBody
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

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
      const productId = UuidV1.create()
      const product = new Product({ id: productId, name: 'product-name', categoryId: UuidV1.create(), storeId: UuidV1.create() })
      stubs.request.method = 'POST'
      stubs.request.params = { productId: productId.value }
      stubs.request.body = requestBody
      stubs.findProductById.execute = jest.fn().mockResolvedValueOnce(product)

      // When
      const result = controller.handle(stubs.request as Request, stubs.response as Response)

      // Then
      void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })
    */
  })
})
