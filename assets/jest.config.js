const { tsconfig } = require('./tsconfig.spec');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testRegex: 'ts/.*\\.(test|spec)?\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true,
    transform: {
        '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig }],
    },
    moduleNameMapper: {
        'vanillajs-datepicker': '<rootDir>/../node_modules/vanillajs-datepicker/dist/js/datepicker.min.js',
    },
};
