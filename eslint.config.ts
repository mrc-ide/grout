import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        files: ["**/*.{js,mjs,cjs,ts}"]
    },
    {
        ignores: ["dist/*", "__mocks__/*"]
    },
    {
        rules: {
            quotes: ["error", "double", { avoidEscape: true }],
            "max-len": [2, 120, 4],
            "arrow-body-style": "off",
            "import/prefer-default-export": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "no-plusplus": "off",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": ["off"],
            "no-underscore-dangle": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"],
            "no-await-in-loop": "off",
            "no-useless-concat": "off",
            "prettier/prettier": [
                "error",
                {
                    tabWidth: 4,
                    semi: true,
                    useTabs: false,
                    singleQuote: false,
                    bracketSpacing: true,
                    endOfLine: "auto",
                    arrowParens: "always",
                    trailingComma: "none"
                }
            ]
        }
    },
    {
        files: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-function": "off",
            "max-classes-per-file": "off",
            "no-useless-constructor": "off"
        }
    }
];
