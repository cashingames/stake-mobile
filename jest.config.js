module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './node_modules/react-native-gesture-handler/jestSetup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|react-native-extended-stylesheet)',
    ]

}