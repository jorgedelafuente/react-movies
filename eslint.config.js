import eslintConfigPrettier from 'eslint-config-prettier'
import typescriptEslint from '@typescript-eslint/eslint-plugin'

export default [
  {
    plugins: {
      typescriptEslint: typescriptEslint,
    },
    rules: {},
  },
  eslintConfigPrettier,
]
