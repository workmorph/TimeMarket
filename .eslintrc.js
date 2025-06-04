module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:security/recommended-legacy",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "security"],
  rules: {
    // TypeScript strict rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    }],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": ["error", {
      allowString: false,
      allowNumber: false,
      allowNullableObject: true,
      allowNullableBoolean: false,
      allowNullableString: false,
      allowNullableNumber: false,
      allowAny: false
    }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: true
    }],

    // JavaScript best practices
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "prefer-const": "error",
    "no-var": "error",
    "prefer-arrow-callback": "error",
    "prefer-template": "error",
    "object-shorthand": "error",
    "no-param-reassign": "error",
    "no-nested-ternary": "error",
    "max-depth": ["error", 4],
    "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
    "complexity": ["error", 15],

    // React specific
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",

    // Security rules
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-child-process": "error",
    "security/detect-disable-mustache-escape": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-non-literal-fs-filename": "warn",
    "security/detect-non-literal-require": "warn",
    "security/detect-possible-timing-attacks": "warn",

    // Import rules
    "import/no-default-export": "off",
    "import/order": ["error", {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true }
    }]
  },
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    },
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "no-console": "off"
      }
    },
    {
      files: ["src/app/**/*.tsx", "src/pages/**/*.tsx"],
      rules: {
        "import/no-default-export": "off"
      }
    }
  ],
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    "coverage/",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts"
  ]
};