import type { Config } from 'jest'
import jestConfig from './jest.config'

const jestConfigAcceptance: Config = {
  ...jestConfig,
  testMatch: [
    '**/tests/acceptance/**/*.spec.ts'
  ]
}

export default jestConfigAcceptance
