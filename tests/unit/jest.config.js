module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/setup/setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  rootDir: '.'
}; 