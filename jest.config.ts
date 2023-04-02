import type { Config } from 'jest'

const jestConfig: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts'
  ],
  testMatch: [
    '**/tests/**/*.(test|spec).ts'
  ],
  clearMocks: true,
  coverageDirectory: './coverage/',
  collectCoverageFrom: ['./src/**'],
  coverageReporters: ['text-summary', 'html'],
  testTimeout: 10000
}

export default jestConfig
