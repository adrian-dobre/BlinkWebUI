module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            ecmaVersion: 2018,
            sourceType: "module"
        }
    },
    rules: {},
    settings: {
        react: {
            version: "detect"
        }
    }
};