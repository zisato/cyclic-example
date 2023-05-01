import { AwilixContainer as AwilixContainerBase } from 'awilix'
import { AwilixContainer } from '../../../../src/simple-kernel/container/awilix-container'

class TestService {}

describe('AwilixContainer unit test suite', () => {
  const stubs = {
    container: {
        hasRegistration: jest.fn(),
        resolve: jest.fn(),
        dispose: jest.fn()
    } as unknown as AwilixContainerBase
  }
  const container = new AwilixContainer(stubs.container)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('When call has method should call container.hasRegistration once with argument', () => {
    const id = 'test-id'

    container.has(id)

    const expectedTimes = 1
    const expectedArguments = 'test-id'
    expect(stubs.container.hasRegistration).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.container.hasRegistration).toHaveBeenCalledWith(expectedArguments)
  })

  test('When call get method should call container.resolve once with argument', () => {
    const id = 'test-id'

    container.get(id)

    const expectedTimes = 1
    const expectedArguments = 'test-id'
    expect(stubs.container.resolve).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.container.resolve).toHaveBeenCalledWith(expectedArguments)
  })

  test('When call hasTyped method should call container.hasRegistration once', () => {
    container.hasTyped(TestService)

    const expectedTimes = 1
    expect(stubs.container.hasRegistration).toHaveBeenCalledTimes(expectedTimes)
  })

  test('When call hasTyped method should call container.hasRegistration with lowercase argument', () => {
    container.hasTyped(TestService)

    const expectedTimes = 1
    const expectedArguments = 'testService'
    expect(stubs.container.hasRegistration).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.container.hasRegistration).toHaveBeenCalledWith(expectedArguments)
  })

  test('When call getTyped method should call container.resolve once', () => {
    container.getTyped(TestService)

    const expectedTimes = 1
    expect(stubs.container.resolve).toHaveBeenCalledTimes(expectedTimes)
  })

  test('When call getTyped method should call container.resolve with lowercase argument', () => {
    container.getTyped(TestService)

    const expectedTimes = 1
    const expectedArguments = 'testService'
    expect(stubs.container.resolve).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.container.resolve).toHaveBeenCalledWith(expectedArguments)
  })

  test('When call dispose method should call container.dispose once', () => {
    container.dispose()

    const expectedTimes = 1
    expect(stubs.container.dispose).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.container.dispose).toHaveBeenCalledWith()
  })
})
