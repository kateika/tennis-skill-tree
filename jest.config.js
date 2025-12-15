module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '\\.scss$': 'identity-obj-proxy',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts, tsx}'],
  testRegex: '(/tests/jest/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
};
