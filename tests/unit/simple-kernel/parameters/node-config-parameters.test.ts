import config from 'config'
import { NodeConfigParameters } from '../../../../src/simple-kernel/parameters/node-config-parameters'

describe('NodeConfigParameters unit test suite', () => {
    beforeAll(() => {
        jest.resetAllMocks()
    })

    describe('has method', () => {
        test('Should return true when exists', () => {
            const parameters = new NodeConfigParameters()
            const existingName = 'existing.name'
            const configValue = {
                existing: {
                    name: 'testName'
                }
            }
            const mockedValue = config.util.extendDeep(config, configValue)
            const configMock = jest.spyOn(config.util, 'extendDeep')
            configMock.mockReturnValueOnce(mockedValue)

            const result = parameters.has(existingName)

            expect(result).toBeTruthy()
        })

        test('Should return false when not exists', () => {
            const parameters = new NodeConfigParameters()
            const notExistingName = 'not.existing.name'
            const configValue = {}
            const mockedValue = config.util.extendDeep(config, configValue)
            const configMock = jest.spyOn(config.util, 'extendDeep')
            configMock.mockReturnValueOnce(mockedValue)

            const result = parameters.has(notExistingName)

            expect(result).toBeFalsy()
        })
    })

    describe('get method', () => {
        test('Should return value when exists', () => {
            const parameters = new NodeConfigParameters()
            const existingName = 'existing.name'
            const configValue = {
                existing: {
                    name: 'testName'
                }
            }
            const mockedValue = config.util.extendDeep(config, configValue)
            const configMock = jest.spyOn(config.util, 'extendDeep')
            configMock.mockReturnValueOnce(mockedValue)

            const result = parameters.get(existingName)

            const expectedResult = 'testName'
            expect(result).toEqual(expectedResult)
        })

        test('Should throw error when not exists', () => {
            const parameters = new NodeConfigParameters()
            const notExistingName = 'not.existing.name'
            const configValue = {}
            const mockedValue = config.util.extendDeep(config, configValue)
            const configMock = jest.spyOn(config.util, 'extendDeep')
            configMock.mockReturnValueOnce(mockedValue)

            const expectedError = new Error(`parameter with name ${notExistingName} not exists`)
            expect(() => {
                parameters.get(notExistingName)
            }).toThrowError(expectedError)
        })
    })
})
