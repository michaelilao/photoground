module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['prettier', 'html'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['debug', 'error'] }],
    'func-names': 'off',
    'no-plusplus': 'off',
    'no-process-exit': 'off',
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 150 }],
    'comma-dangle': 0,
    'object-curly-newline': 'off',
    'import/prefer-default-export': 'off',
  },
  settings: {
    'html/html-extensions': ['.html'],
  },
};
