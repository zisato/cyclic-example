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
      redirect: jest.fn()
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

  test('Should call res.redirect method when valid request', async () => {
    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArgument = '/'
    expect(stubs.response.redirect).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.redirect).toHaveBeenCalledWith(expectedArgument)
  })
})
