import { Request, Response } from 'express'
import CreateDemo from '../../../src/application/demo/create/create-demo'
import CreateDemoController from '../../../src/infrastructure/controller/demo-controller'

describe('DemoController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
    createDemo: Partial<CreateDemo>
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
    createDemo: {
      execute: jest.fn()
    }
  }
  const controller = new CreateDemoController(stubs.createDemo as CreateDemo)

  test('Should call createDemo.execute method when valid request', async () => {
    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expected = {}
    expect(stubs.createDemo.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createDemo.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call res.send method when valid request', async () => {
    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.send).toHaveBeenCalledTimes(1)
  })

  test('Should return 201 when valid request', async () => {
    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    expect(stubs.response.status).toHaveBeenCalledTimes(1)
    expect(stubs.response.status).toHaveBeenCalledWith(201)
  })
})
