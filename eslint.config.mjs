module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  globals: {
    logger: 'readonly',
    helpers: 'readonly',
    VueClass: 'readonly',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-debugger': 'warn',
    'no-useless-catch': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '(^_$|_ignored$)',
        argsIgnorePattern: '(^_$|_ignored$)',
      },
    ],
    'no-redeclare': 'off', // off to use @typescript-eslint/no-redeclare instead
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/no-duplicate-imports': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-async-promise-executor': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'vue/require-explicit-emits': 'warn',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/require-valid-default-prop': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'warn',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        '@typescript-eslint/no-invalid-this': 'error',
      },
    },
    {
      files: ['server/**/*.ts', 'src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        'no-console': 'warn',
      },
    },
  ],
};
