module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'etc',
    'unused-imports',
    'simple-import-sort',
    "@darraghor/nestjs-typed",
    "import",
    "unicorn"
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "plugin:@darraghor/nestjs-typed/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'error',
    'etc/no-commented-out-code': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    "@darraghor/nestjs-typed/controllers-should-supply-api-tags": "off",
    "@darraghor/nestjs-typed/api-method-should-specify-api-response": "off",
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      }
    ],
    'no-empty': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    "import/no-relative-parent-imports": "error",
    "@darraghor/nestjs-typed/param-decorator-name-matches-route-param": "off",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/better-regex": "error",
    "unicorn/filename-case": "error",
    "unicorn/no-anonymous-default-export": "error",
    "unicorn/no-empty-file": "error",
    "unicorn/no-nested-ternary": "error",	
    "unicorn/no-new-buffer": "error",
    "unicorn/throw-new-error": "error",
  },
  overrides: [
    {
      'files': [
        '*.spec.ts'
      ],
      'rules': {
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    }
  ]
};
