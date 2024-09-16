import eslintConfigPrettier from 'eslint-config-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
   {
      plugins: {
         typescriptEslint: typescriptEslint,
         '@tanstack/query': pluginQuery,
      },
      rules: { '@tanstack/query/exhaustive-deps': 'error' },
   },
   eslintConfigPrettier,
];
