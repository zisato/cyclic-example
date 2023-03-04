import { JsonConfiguration } from "../../../src/kernel/container/json-configuration"

describe('JsonConfiguration unit test suite', () => {
    describe('has method', () => {
        test('Should return true when exists', () => {
            const existingName = 'existing.name'
            const config = {
                existing: {
                    name: 'testName'
                }
            }
            const configuration = new JsonConfiguration(config)

            const result = configuration.has(existingName)

            expect(result).toBeTruthy()
        })

        test('Should return false when not exists', () => {
            const notExistingName = 'not.existing.name'
            const config = {
                existing: {
                    name: 'testName'
                }
            }
            const configuration = new JsonConfiguration(config)

            const result = configuration.has(notExistingName)

            expect(result).toBeFalsy()
        })
    })

    describe('get method', () => {
        test('Should return value when exists', () => {
            const existingName = 'existing.name'
            const config = {
                existing: {
                    name: 'testName'
                }
            }
            const configuration = new JsonConfiguration(config)

            const result = configuration.get(existingName)

            const expectedResult = 'testName'
            expect(result).toEqual(expectedResult)
        })

        test('Should return undefined when not exists', () => {
            const notExistingName = 'not.existing.name'
            const config = {
                existing: {
                    name: 'testName'
                }
            }
            const configuration = new JsonConfiguration(config)

            const result = configuration.get(notExistingName)

            expect(result).toBeUndefined()
        })
    })
})
