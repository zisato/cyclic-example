import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../../../../src/app'
import { UuidV1 } from '../../../../../../src/infrastructure/identity/uuid-v1'
import { Identity } from '../../../../../../src/domain/identity/identity'
import CreateDemo from '../../../../../../src/application/demo/create/create-demo'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'
import { Product } from '../../../../../../src/domain/product/product'

describe('Update Product acceptance test', () => {
    let server: Server | null = null
    const app = new App()

    beforeEach(() => {
        app.boot()
        const parameters = app.getParameters()
        server = app.startServer(parameters.get<number>('express.port'))
    })

    afterEach(() => {
        app.shutdown()
        server = null
    })

    function givenRoute(productId: string): string {
      return `/admin/products/${productId}/update`
    }

    function givenValidRequestBody(): any {
        return {
            attributes: {
                name: 'new-product-name'
            }
        }
    }

    async function givenExistingProduct(id: Identity, categoryId: Identity, storeId: Identity): Promise<void> {
        const productRepository = app.getContainer().get<ProductRepository>('productRepository')

        await productRepository.save(new Product({ id, name: 'product-name', categoryId, storeId }))
    }

    describe('GET method', () => {
        test('When valid request returns 200 status code', async () => {
            // Given
            const productId = UuidV1.create()
            const categoryId = CreateDemo.FIXTURES.categories[0].id
            const storeId = CreateDemo.FIXTURES.store.id
            await givenExistingProduct(productId, new UuidV1(categoryId), new UuidV1(storeId))
            const route = givenRoute(productId.value)

            // When
            const response = await request(server).get(route).send()

            // Then
            const expectedStatusCode = 200
            expect(response.statusCode).toEqual(expectedStatusCode)
        })
    })

    describe('POST method', () => {
        test('Redirect to store update when updated', async () => {
            // Given
            const productId = UuidV1.create()
            const categoryId = CreateDemo.FIXTURES.categories[0].id
            const storeId = CreateDemo.FIXTURES.store.id
            await givenExistingProduct(productId, new UuidV1(categoryId), new UuidV1(storeId))
            const requestBody = givenValidRequestBody()
            const route = givenRoute(productId.value)

            // When
            const response = await request(server).post(route).send(requestBody)

            // Then
            const expectedStatusCode = 302
            expect(response.statusCode).toEqual(expectedStatusCode)
        })

        test('Changes are persisted in repository when updated', async () => {
            // Given
            const productId = UuidV1.create()
            const categoryId = CreateDemo.FIXTURES.categories[0].id
            const storeId = CreateDemo.FIXTURES.store.id
            await givenExistingProduct(productId, new UuidV1(categoryId), new UuidV1(storeId))
            const requestBody = givenValidRequestBody()
            const route = givenRoute(productId.value)

            // When
            await request(server).post(route).send(requestBody)

            // Then
            const expectedName = 'new-product-name'
            const productRepository = app.getContainer().get<ProductRepository>('productRepository')
            const product = await productRepository.get(productId)
            expect(product.name).toEqual(expectedName)
        })

        test('When not existing product id returns 404 status code', async () => {
            // Given
            const requestBody = givenValidRequestBody()
            const route = givenRoute(UuidV1.create().value)

            // When
            const response = await request(server).post(route).send(requestBody)

            // Then
            const expectedStatusCode = 404
            expect(response.statusCode).toEqual(expectedStatusCode)
        })
    })
})
