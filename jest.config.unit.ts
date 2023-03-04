import type { Config } from 'jest'
import jestConfig from './jest.config'

const jestConfigUnit: Config = {
  ...jestConfig,
  testMatch: [
    '**/tests/**/*.test.ts'
  ]
}

export default jestConfigUnit
