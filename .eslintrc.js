/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest'
  },

  env: {
    browser: true,
    es2022: true
  },

  extends: [
    'plugin:vue/vue3-recommended', // https://eslint.vuejs.org/user-guide/
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugins: ['simple-import-sort'],
  rules: {
    'quotes': ['error', 'single', { avoidEscape: true }],
    'vue/multi-word-component-names': 'off',
    'simple-import-sort/imports': [2],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/ban-ts-comment': ['warn'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true } ],
    '@typescript-eslint/consistent-type-imports': [
      2,
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    // allow async-await
    'generator-star-spacing': 'off',
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    // when using typescript, this is recommended to be off
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
    'no-undef': 'off',
    // forces to wrap statements and return types into curly braces
    // https://eslint.org/docs/rules/curly
    curly: ['error', 'all'],
    'require-await': ['error'],
    semi: ['error', 'never'],
    indent: ['error', 2],
    'max-len': [
      2,
      {
        code: 120,
        comments: 120,
        ignorePattern: '',
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'import/no-webpack-loader-syntax': 'off',
    'import/no-unresolved': 'off',
    'no-unsafe-optional-chaining': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'vue/one-component-per-file': 'off',
        'vue/no-v-html': 'off',
        'vue/no-v-model-argument': 'off',
        'vue/max-len': ['error', {
          code: 120,
          template: 120,
          tabWidth: 2,
          comments: 120,
          ignorePattern: '',
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreHTMLAttributeValues: true,
          ignoreHTMLTextContents: true,
        }],
        'vue/singleline-html-element-content-newline': ['error', {
          'ignoreWhenNoAttributes': true,
          'ignoreWhenEmpty': true
        }]
      }
    }
  ]
};
