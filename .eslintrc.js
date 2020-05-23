module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "airbnb",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            ecmaVersion: 2018,
            sourceType: "module"
        }
    },
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        "consistent-return": "off",
        "react/jsx-filename-extension": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "react/destructuring-assignment": "off",
        "comma-dangle": ["error", "never"],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "react/jsx-boolean-value": "off",
        "max-len": ["error", 120],
        "object-shorthand": ["error", "never"],
        "lines-between-class-members": "off",
        "max-classes-per-file": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};