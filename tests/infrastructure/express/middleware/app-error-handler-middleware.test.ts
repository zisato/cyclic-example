import { NextFunction, Request, Response } from 'express'
import AppErrorHandlerMiddleware from '../../../../src/infrastructure/express/middleware/app-error-handler-middleware'

class AppErrorHandlerMiddlewareTestError extends Error {}

describe('AppErrorHandlerMiddleware unit test suite', () => {
    const stubs: {
        request: Partial<Request>
        response: Partial<Response>
        next: Partial<NextFunction>
      } = {
        request: {},
        response: {
          status: jest.fn().mockImplementation(() => {
            return stubs.response
          }),
          json: jest.fn()
        },
        next: jest.fn()
      }
    const middleware = new AppErrorHandlerMiddleware()

    test('Should call response.status once with arguments', async () => {
        const error = new Error('Test error')

        // When
        await middleware.handle(error, stubs.request as Request, stubs.response as Response, stubs.next as NextFunction)

        // Then
        const expectedTimes = 1
        const expectedArguments = 500
        expect(stubs.response.status).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.response.status).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call response.json once with arguments', async () => {
        const error = new Error('Test error')

        // When
        await middleware.handle(error, stubs.request as Request, stubs.response as Response, stubs.next as NextFunction)

        // Then
        const expectedTimes = 1
        const expectedArguments = { message: 'Test error' }
        expect(stubs.response.json).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.response.json).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should return default value when not found constructor name in error mapping', async () => {
        const middleware = new AppErrorHandlerMiddleware(new Map<string, number>([
            [AppErrorHandlerMiddlewareTestError.constructor.name, 400]
        ]))
        const error = new Error('Test error')

        // When
        await middleware.handle(error, stubs.request as Request, stubs.response as Response, stubs.next as NextFunction)

        // Then
        const expectedArguments = 500
        expect(stubs.response.status).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should return error code value when found class name in error mapping', async () => {
        const middleware = new AppErrorHandlerMiddleware(new Map<string, number>([
            [AppErrorHandlerMiddlewareTestError.name, 400]
        ]))
        const error = new AppErrorHandlerMiddlewareTestError('Test error')

        // When
        await middleware.handle(error, stubs.request as Request, stubs.response as Response, stubs.next as NextFunction)

        // Then
        const expectedArguments = 400
        expect(stubs.response.status).toHaveBeenCalledWith(expectedArguments)
    })
})
