module.exports = {
    globals: {
        'ts-jest': {
          tsConfig: 'tsconfig.test.json'
        }
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
}