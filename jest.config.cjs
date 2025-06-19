// jest.config.cjs
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/**/*.test.js']
};