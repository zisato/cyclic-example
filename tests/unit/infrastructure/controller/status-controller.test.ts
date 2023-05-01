import { Request, Response } from 'express'
import StatusController from '../../../../src/infrastructure/controller/status-controller'

describe('StatusController unit test', () => {
  const stubs: {
    request: Partial<Request>
    response: Partial<Response>
  } = {
    request: {},
    response: {
      json: jest.fn()
    }
  }
  const controller = new StatusController()

  test('Should call res.json method when valid request', async () => {
    // When
    await controller.handle(stubs.request as Request, stubs.response as Response)

    // Then
    const expectedTimes = 1
    const expectedArgument = { 'status': 'ok' }
    expect(stubs.response.json).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.response.json).toHaveBeenCalledWith(expectedArgument)
  })
})
